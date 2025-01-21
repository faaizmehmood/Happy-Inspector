import { Router } from "express";
import { createProperty, editExistingProperty, getProperties, getCompleteProperties, deleteProperty, getPropertyById } from "../controllers/propertyController.js";
import { addPropertyCategory, getUserPropertyCategories } from "../controllers/propertyCategoryController.js";

// Importing the Middleware
import { authenticateToken } from "../middlewares/authenticateToken.js";
import upload from "../middlewares/imageUpload.js";

import { 

    propertyCreationTierLimitAuthorization,
    subUserRestrictionAuthorization,
    subUserManagerExpiryAuthorization,
    topTierAuthorization,
    categoryAuthorization
    
} from "../middlewares/authorization.js";

export const propertyRoutes = Router();

// Add Category
propertyRoutes.post("/addPropertyCategory", authenticateToken, topTierAuthorization, addPropertyCategory);

// Get User Categories
propertyRoutes.get("/getUserPropertyCategories", authenticateToken, categoryAuthorization, getUserPropertyCategories);

// Create Property
propertyRoutes.post("/createProperty", authenticateToken, propertyCreationTierLimitAuthorization, upload, createProperty);

// Edit Existing Property
propertyRoutes.put("/editExistingProperty", authenticateToken, subUserManagerExpiryAuthorization, upload, editExistingProperty);

// Get Properties based on user's id
propertyRoutes.get("/getProperties", authenticateToken, subUserManagerExpiryAuthorization, getProperties);

// Get Complete Properties based on Searching
propertyRoutes.post("/getCompleteProperties", authenticateToken, subUserManagerExpiryAuthorization, getCompleteProperties);

// Delete Property
propertyRoutes.delete("/deleteProperty/:id", authenticateToken, subUserRestrictionAuthorization, deleteProperty);

// Get Property by Id
propertyRoutes.get("/getPropertyById/:id", authenticateToken, subUserManagerExpiryAuthorization, getPropertyById);

