import { Router } from "express";
import {
    login,
    getAllUsers,
    checkAdminAuthStatus
} from "../controllers/superAdminController.js";

import { fetchUserDetails } from "../controllers/userController.js";
import { getAllSubUsers } from "../controllers/subUserController.js";
// Importing the Middleware
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { superAdminAuthorization } from "../middlewares/authorization.js";
import { getCompleteProperties } from "../controllers/propertyController.js";
import { getInspections } from "../controllers/inspectionController.js";
import { getAllTemplates } from "../controllers/inspectionTemplateController.js";

import { getPricingPlan, updatePricingPlan, changeFreeTierReportWatermark } from "../controllers/pricingController.js";

export const superAdminRoutes = Router();

// ------------------------------------------
// Super Admin Routes
// ------------------------------------------

// Login
superAdminRoutes.post("/login", login);

// Get All Users
superAdminRoutes.get("/getAllUsers", authenticateToken, superAdminAuthorization, getAllUsers);

// Get User Details
superAdminRoutes.get("/fetchUserDetails", authenticateToken, superAdminAuthorization, fetchUserDetails);

// Get All Sub Users
superAdminRoutes.post("/getAllSubUsers", authenticateToken, superAdminAuthorization, getAllSubUsers);

// Get Complete Properties
superAdminRoutes.get("/getProperties", authenticateToken, superAdminAuthorization, getCompleteProperties);

// Get All Inspections
superAdminRoutes.post("/getInspections", authenticateToken, superAdminAuthorization, getInspections);

// Get All Templates
superAdminRoutes.post("/getAllTemplates", authenticateToken, superAdminAuthorization, getAllTemplates);

// Check Admin Auth Status
superAdminRoutes.get("/checkAdminAuthStatus", authenticateToken, superAdminAuthorization, checkAdminAuthStatus);

// Get Pricing Plan
superAdminRoutes.get("/getPricingPlan", authenticateToken, superAdminAuthorization, getPricingPlan);

// Update Pricing Plan
superAdminRoutes.patch("/updatePricingPlan", authenticateToken, superAdminAuthorization, updatePricingPlan);

// Change Free Tier Report Watermark
superAdminRoutes.patch("/changeFreeTierReportWatermark", authenticateToken, superAdminAuthorization, changeFreeTierReportWatermark);

