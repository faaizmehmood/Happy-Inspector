import subUserModel from "../models/subUserModel.js";
import userModel from "../models/userModel.js";
import { sendSubUserSignUpMail } from "../services/signatureMailing.js";
import { v4 as uuidv4 } from 'uuid';
import { createHmac } from "crypto";
import { loginValidation } from "../services/formValidation.js";
import { checkIfEmailExistsInUserAndSubUser } from "../services/subUserService.js";
import userActivityModel from "../models/userActivityModel.js";

export const createSubUser = async (req, res) => {
    try {
        const { name, email, address, phoneNumber, canCreateInspectionQuestions, canInspectFromScratch, assignedCategories } = req.body;
        const { _id } = req.user;

        // Check if email already exists in User or Sub User
        const emailExists = await checkIfEmailExistsInUserAndSubUser(email);
        if (emailExists) {
          return res.status(400).send({
            message: "A user with this email already exists!",
          });
        }

        const manager = await userModel.findById(_id).select("fullname");

        const defaultPassword = uuidv4();

        const subUser = await subUserModel.create({
          manager: _id,
          fullname: name,
          email,
          password: defaultPassword,
          address,
          phoneNumber,
          canCreateInspectionQuestions,
          canInspectFromScratch,
          assignedCategories: assignedCategories.map((category) => ({
              value: category.value,
              iconId: category.iconId,
          })),
      });

        await userActivityModel.create({
            user: _id,
            subUser: subUser._id,
            activity: `You created a Sub User ${name} and assigned ${assignedCategories.length == 0 ? "no " : ""}property categories ${assignedCategories.map(category => category.value).join(", ")} to them.`,
            subActivity: `${manager.fullname} has assigned ${assignedCategories.length == 0 ? "no " : ""}property categories ${assignedCategories.map(category => category.value).join(", ")} to you.`,
        });

        await sendSubUserSignUpMail(subUser._id, name, email, defaultPassword, manager);
        
        return res.status(201).send({
        message: "Sub User created successfully!",
        });

    } catch (err) {

        //Delete the sub user if the mail sending fails
        await subUserModel.deleteOne({ email: req.body.email });

        return res.status(400).send({
        message: "Failed to create Sub User!",
        error: err.message,
        });
    }
}

export const updateSubUser = async (req, res) => {

    try {
        
        const { subUserId, name, email, address, phoneNumber, canCreateInspectionQuestions, canInspectFromScratch, assignedCategories } = req.body;

        const user = await userModel.findById(req.user._id);

        if (!user) {
          return res.status(400).send({
            message: "User not found!",
          });
        }

        await subUserModel.findByIdAndUpdate(subUserId, {
            fullname: name,
            email,
            address,
            phoneNumber,
            canCreateInspectionQuestions,
            canInspectFromScratch,
            assignedCategories: assignedCategories.map((category) => ({
              value: category.value,
              iconId: category.iconId,
          })),
        });

        await userActivityModel.create({
            user: user._id,
            subUser: subUserId,
            activity: `You updated the Sub User ${name} and assigned ${assignedCategories.length == 0 ? "no " : ""}property categories ${assignedCategories.map(category => category.value).join(", ")} to them.`,
            subActivity: `${user.fullname} has assigned ${assignedCategories.length == 0 ? "no " : ""}property categories ${assignedCategories.map(category => category.value).join(", ")} to you.`,
        });

        return res.status(200).send({
            message: "Sub User updated successfully!",
        });
    }
    catch (err) {
        return res.status(400).send({
            message: "Failed to update Sub User!",
            error: err.message,
        });
    }
}

export const deleteSubUser = async (req, res) => {
    const subUserId = req.params.id;

    try {
        await subUserModel.findByIdAndDelete(subUserId);
        return res.status(200).send({
            message: "Sub User deleted successfully!",
        });
    } catch (err) {
        return res.status(400).send({
            message: "Failed to delete Sub User!",
            error: err.message,
        });
    }
}

// Login
export const subUserLogin = async (req, res) => {
  // Validate user input data using joi schema
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
    const resData = await subUserModel.matchPasswordAndGenerateTokens(
      email,
      password,
      deviceType
    );

    const { user, accessToken } = resData;

    //Update Sub User's last Online
    user.lastOnline = new Date();
    await user.save();

    res.cookie("accessToken", accessToken);
    return res.status(200).json({
      message: "subUser Authenticated!",
      userData: { ...user["_doc"] },
    });
  } catch (err) {
    return res.status(400).send({
      message: "Incorrect Email or Password",
      error: err.message,
    });
  }

};

// Change Password
export const changePassword = async (req, res) => {
    try {

      const { _id } = req.user;
      const { currentPassword, newPassword } = req.body;

      // Get user details
      const subUser = await subUserModel.findById(_id);
  
      if (!subUser) {
        return res.status(400).send({
          message: "User not found!",
        });
      }
  
      const salt = subUser.salt;
      const hashedPassword = subUser.password;
  
      const userProvidedHash = createHmac("sha256", salt)
        .update(currentPassword)
        .digest("hex");
  
      if (hashedPassword !== userProvidedHash) {
        return res.status(400).send({
          message: "Current password is incorrect!",
        });
      }
  
      // Update user's password and save to database
      subUser.password = newPassword;
      
      // Change the last online to the current time
      subUser.lastOnline = new Date();
      await subUser.save();
  
      return res.status(201).send({
        message: "Password changed successfully!",
        subUserDetails: subUser,
      });
    } catch (err) {
      return res.status(400).send({
        message: "Failed to change password!",
        error: err.message,
      });
    }
  };

export const getSubUserById = async (req, res) => {
    const subUserId = req.params.id;

    try {
        const subUser = await subUserModel.findById(subUserId);
        if (!subUser) {
            return res.status(400).send({
                message: "Sub User not found!",
            });
        }

        return res.status(200).send({
            message: "Sub User fetched successfully!",
            subUser,
        });
    } catch (err) {
        return res.status(400).send({
            message: "Failed to fetch Sub User!",
            error: err.message,
        });
    }
}

export const getAllSubUsers = async (req, res) => {

    const limit = 10;

    try {
        const { _id, role } = req.user;
        const { page = 1, search, keyword } = req.body;
        let userid = _id;

        let subUsers =[];

        if (role === "superAdmin")
        {
          let { id } = req.query;
    
          if (!id) {
            return res.status(400).send({
              message: "User not found!",
            });
          }
          userid = id;
        }
        else
        {
          const topTierUser = await userModel.findById(userid);
          if (!topTierUser) {
            return res.status(400).send({
                message: "Top Tier User not found!",
            });
          }
        }

        let query = { manager: userid };

        if (search !== "")
        {
            query.fullname = { $regex: search, $options: "i" };
        }

        if (keyword == "All Members" || keyword == "")
        {
            
        }
        else if (keyword == "All Categories")
        {
            query.assignedCategories = topTierUser.propertyCategories;
        }
        else if (keyword == "Unassigned")
        {
            query.assignedCategories = [];
        }
        else
        {
          query["assignedCategories.value"] = keyword;
        }

        subUsers = await subUserModel
        .find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .select(" _id fullname createdAt lastOnline assignedCategories");

        //Convert last online to hours or days or months or years, iflast online is within a few seconds of createdAt then send N/A
        var currentDate = new Date();
        subUsers = subUsers.map((subUser) => {
            var lastOnline = subUser.lastOnline;
            var diff = currentDate - lastOnline;
            var days = Math.floor(diff / (1000 * 60 * 60 * 24));
            var hours = Math.floor(diff / (1000 * 60 * 60));
            var months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
            var years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

            var creationDiff = subUser.createdAt - lastOnline;
            // console.log("diff", diff, "creationDiff", creationDiff);

            if (creationDiff < 2000) //If last online is within a 2 seconds of createdAt
            {
                lastOnline = "N/A";
            }
            else if (days > 30)
            {
                if (months > 12)
                {
                  lastOnline = years + " years ago";
                }
                else
                {
                  lastOnline = months + " months ago";
                }
            }
            else
            {
                if (hours > 24)
                {
                  lastOnline = days + " days ago";
                }
                else
                {
                  lastOnline = hours + " hours ago";
                }
            }
            return {
                _id: subUser._id,
                userName: subUser.fullname,
                addedOn: subUser.createdAt,
                lastOnline: lastOnline,
                categoriesAssigned: subUser.assignedCategories,
            }
        });

        const totalSubUsers = await subUserModel.find(query).countDocuments();

        return res.status(200).send({
            message: "Sub Users fetched successfully!",
            subUsers,
            totalSubUsers,
            totalPages: Math.ceil(totalSubUsers / limit),
            currentPage: parseInt(page),
        });


    } catch (err) {
        return res.status(400).send({
            message: "Failed to fetch Sub Users!",
            error: err.message,
        });
    }
}
