import superAdminModel from "../models/superAdminModel.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { loginValidation } from "../services/formValidation.js";

export const createSuperAdmin = async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        const superAdmin = await superAdminModel.create({
            fullname,
            email,
            password,
        });
        return res.status(201).json({
            message: "Super Admin created successfully!",
            superAdmin,
        });
    } catch (error) {
        console.error("Super Admin creation error:", error);
        return res.status(400).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) {
        console.log("Login validation error", error);
        return res.status(400).send({
            message: error.details[0].message,
        });
    }
    // If user input data is valid, proceed to login
    // Destructure email and password from req.body
    const { email, password, deviceType } = req.body;
    try {
        const resData = await superAdminModel.matchPasswordAndGenerateTokens(
            email,
            password,
            deviceType
        );
        const { user, accessToken, status, message } = resData;

        if (status == false)
        {
            return res.status(400).json({ status, message });
        }
        
        res.cookie("accessToken", accessToken);
        return res.status(200).json({
            message,
            userData: {
                ...user["_doc"],
                _id: undefined,
                salt: undefined,
                password: undefined,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try 
    {
        let {page = 1, limit = 10, search = "", filter = "all"} = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        if (typeof page !== "number" || typeof limit !== "number" || page < 1 || limit < 1)
        {
            return res.status(400).json({ status: false, message: "Invalid page or limit" });
        }

        if (typeof filter !== "string" || typeof search !== "string")
        {
            return res.status(400).json({ status: false, message: "Invalid filter or search" });
        }

        let query = {};

        if (search !== "")
        {
            query.$or = [
                { fullname: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        if (filter == "TOPTIER")
        {
            query.role = "TOPTIER";
        }
        else if (filter == "STANDARDTIER")
        {
            query.role = "STANDARDTIER";
        }
        else if (filter == "FREETIER")
        {
            query.role = "FREETIER";
        }

        const users = await userModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-password -salt");

        const totalUsers = await userModel.countDocuments(query);

        return res.status(200).json({
            message: "Users fetched successfully!",
            users,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: parseInt(page),
        });

    } catch (error) {
        console.error("Get all users error:", error);
        return res.status(400).json({ message: error.message });
    }
};

// Check if user is authenticated and send user data
export const checkAdminAuthStatus = async (req, res) => {
    const token = req.cookies.accessToken;
  
    if (!token) {
      return res.json({ isAuthenticated: false, role: null });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const superAdmin = await superAdminModel.findById(decoded._id);
  
      if (superAdmin ) {
        return res.send({ isAuthenticated: true, userData: {
          ...superAdmin["_doc"],
          salt: undefined,
          password: undefined,
        }});
      } else {
        return res.send({ isAuthenticated: false, role: null });
      }
    } catch (err) {
      return res.status(400).send({ isAuthenticated: false, role: null });
    }
};