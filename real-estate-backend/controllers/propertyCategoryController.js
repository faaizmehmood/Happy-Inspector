import userModel from "../models/userModel.js";
import subUserModel from "../models/subUserModel.js";
import { PropertyCategoryVerification } from "../services/categoryVerification.js";

// Add Property Category

export const addPropertyCategory = async (req, res) => {
    
    try {

        const { value, iconId } = req.body;
        const { _id, role } = req.user;
        
        const verification = await PropertyCategoryVerification(role, _id);
        if (!verification) {
            return res.status(400).send({
            message: "Failed to add category! You have reached the maximum number of categories allowed.",
            });
        }

        await userModel.findByIdAndUpdate(_id, {
            $push: {
                propertyCategories: {
                    value,
                    iconId,
                },
            },
        });

        return res.status(200).send({
            message: "Category added successfully!",
            category: {
                value,
                iconId,
            },
        });

    } catch (error) {
        console.error("Error adding category:", error);
        return res.status(400).send({
        message: "Failed to add category!",
        });
    }
};

// Get User Property Categories
export const getUserPropertyCategories = async (req, res) => {

    try {
        const { _id, role } = req.user;
        var user;
        let categories;

        if (role == "SUBUSER")
        {
            user = await subUserModel.findById(_id);
            categories = user.assignedCategories ? user.assignedCategories : [];
        }
        else
        {
            user = await userModel.findById(_id);
            categories = user.propertyCategories ? user.propertyCategories : [];
        }

        if (!user) {
            return res.status(400).send({
                message: "User or Sub User not found!",
            });
        }

        return res.status(200).send({
            categories: categories,
        });

    } catch (error) {
        console.error("Error fetching user categories:", error);
        return res.status(400).send({
            message: "Failed to fetch user categories!",
        });
    }
};