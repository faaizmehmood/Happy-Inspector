import { Router } from "express";
import {
    createSubUser,
    updateSubUser,
    deleteSubUser,
    getSubUserById,
    getAllSubUsers,
    subUserLogin,
    changePassword
} from "../controllers/subUserController.js";

// Importing the Middleware
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { topTierAuthorization, subUserAuthorization } from "../middlewares/authorization.js";

export const subUserRoutes = Router();

// Create Sub User
subUserRoutes.post("/createSubUser", authenticateToken, topTierAuthorization, createSubUser);

// Update Sub User
subUserRoutes.patch("/updateSubUser", authenticateToken, topTierAuthorization, updateSubUser);

// Delete Sub User
subUserRoutes.delete("/deleteSubUser/:id", authenticateToken, topTierAuthorization, deleteSubUser);

// Get Sub User By Id
subUserRoutes.get("/getSubUserById/:id", authenticateToken, topTierAuthorization, getSubUserById);

// Get All Sub Users
subUserRoutes.post("/getAllSubUsers", authenticateToken, topTierAuthorization, getAllSubUsers);

// Login
subUserRoutes.post("/subUserLogin", subUserLogin);

// Change Password
subUserRoutes.patch("/changePassword", authenticateToken, subUserAuthorization, changePassword);