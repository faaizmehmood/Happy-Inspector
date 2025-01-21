import { Router } from "express";
import {
  addPersonalDetails,
  addBusinessDetails,
  fetchUserDetails,
  changePassword,
  changePersonalInfo,
  changeBusinessInfo,
  changeRole,
  getUserInspectionAndPropertyData,
  getCollaboratorPendingSignatureData,
  getActivityFeed,
  getAllActivityFeed
} from "../controllers/userController.js";

import { getUnReadActivities, markAsReadActivity } from "../controllers/activityController.js";

import { getPricingTiers } from "../controllers/pricingController.js";

// Importing the Middleware
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { subUserManagerExpiryAuthorization, subUserRestrictionAuthorization } from "../middlewares/authorization.js";
import upload from "../middlewares/imageUpload.js";

export const userRoutes = Router();

// ------------------------------------------
// User Routes
// ------------------------------------------

// Add Peronal Details
userRoutes.patch("/addPersonalDetails", authenticateToken, upload, addPersonalDetails);

// Add Business Details
userRoutes.patch("/addBusinessDetails", authenticateToken, addBusinessDetails);

// Fetch User Details
userRoutes.get("/fetchUserDetails", authenticateToken, subUserManagerExpiryAuthorization, fetchUserDetails);

// Change Password
userRoutes.patch("/changePassword", authenticateToken, subUserManagerExpiryAuthorization, changePassword);

// Change Personal Details
userRoutes.patch("/changePersonalInfo", authenticateToken,  upload, changePersonalInfo);

// Change Business Details
userRoutes.patch("/changeBusinessInfo", authenticateToken, upload, changeBusinessInfo);

// Change Role
userRoutes.patch("/changeRole", authenticateToken, changeRole);

// Get User Inspection and Property Data
userRoutes.get("/getUserInspectionAndPropertyData", authenticateToken, subUserManagerExpiryAuthorization, getUserInspectionAndPropertyData);

// Get Collaborator Pending Signature Data
userRoutes.get("/getCollaboratorPendingSignatureData", authenticateToken, subUserManagerExpiryAuthorization, getCollaboratorPendingSignatureData);

// Get Activity Feed
userRoutes.get("/getActivityFeed", authenticateToken, subUserManagerExpiryAuthorization, getActivityFeed);

// Get All Activity Feed
userRoutes.get("/getAllActivityFeed", authenticateToken, subUserManagerExpiryAuthorization, getAllActivityFeed);

// Get Un Read Activities
userRoutes.get("/getUnReadActivities", authenticateToken, subUserManagerExpiryAuthorization, getUnReadActivities);

// Mark As Read Activity
userRoutes.patch("/markAsReadActivity", authenticateToken, subUserManagerExpiryAuthorization, markAsReadActivity);

// Get Pricing Tiers
userRoutes.get("/getPricingTiers", authenticateToken, subUserRestrictionAuthorization, getPricingTiers);