import { Router } from "express";
import { 
    createInspectionTemplate, 
    createDefaultInspectionTemplate, 
    createInspectionTemplateDraft, 
    createBasicInspectionTemplateDraft,
    getTemplates,
    getAllTemplates,
    TemplateAddRoom,
    TemplateAddElement,
    TemplateDeleteRoom,
    TemplateDeleteElement,
    getSpecificTemplate,
    getTemplateRoomData,
    TemplateUpdateRoom,
    TemplateAddChecklistItem,
    TemplateDeleteChecklistItem,
    reArrangeRooms,
    reArrangeElements,
    saveTemplateAsDraft,
    saveTemplateAsComplete,
    cloneInspectionTemplate,
    deleteTemplate
} from "../controllers/inspectionTemplateController.js";

import {
    deleteQuestionTemplate,
} from "../controllers/questionTemplateController.js";

// Importing the Middleware
import { authenticateToken } from "../middlewares/authenticateToken.js";

import { 

    templateCreationTierLimitAuthorization,
    templateRoomLimitAuthorization,
    templateElementLimitAuthorization,
    subUserRestrictionAuthorization,
    subUserManagerExpiryAuthorization,
    templateNotDefaultCheck
    
 } from "../middlewares/authorization.js";

export const templateRoutes = Router();

//--------------------------------------------------------------*********************--------------------------------------------------------------
// TEMPLATE ROUTES BELOW
// Create Inspection Template
templateRoutes.post("/createInspectionTemplate", authenticateToken, createInspectionTemplate);

// Create Default Inspection Template
templateRoutes.post("/createDefaultInspectionTemplate", createDefaultInspectionTemplate);

// Create Inspection Template Draft
templateRoutes.post("/createInspectionTemplateDraft", authenticateToken, templateCreationTierLimitAuthorization, createBasicInspectionTemplateDraft);

// Get Templates
templateRoutes.get("/getTemplates", authenticateToken, subUserManagerExpiryAuthorization, getTemplates);

// Get All Templates
templateRoutes.post("/getAllTemplates", authenticateToken, subUserRestrictionAuthorization, getAllTemplates);

// Add Room
templateRoutes.post("/templateAddRoom", authenticateToken, templateNotDefaultCheck, templateRoomLimitAuthorization, TemplateAddRoom);

// Add Element
templateRoutes.post("/templateAddElement", authenticateToken, templateNotDefaultCheck, templateElementLimitAuthorization, TemplateAddElement);

// Delete Room
templateRoutes.patch("/templateDeleteRoom", authenticateToken, templateNotDefaultCheck, subUserRestrictionAuthorization, TemplateDeleteRoom);

// Delete Element
templateRoutes.patch("/templateDeleteElement", authenticateToken, templateNotDefaultCheck, subUserRestrictionAuthorization, TemplateDeleteElement);

// Get Specific Template
templateRoutes.get("/getSpecificTemplate/:id", authenticateToken, subUserRestrictionAuthorization, getSpecificTemplate);

// Get Template Room Data
templateRoutes.post("/getTemplateRoomData", authenticateToken, subUserRestrictionAuthorization, getTemplateRoomData);

// Template Update Room
templateRoutes.patch("/templateUpdateRoom", authenticateToken, templateNotDefaultCheck, subUserRestrictionAuthorization, TemplateUpdateRoom);

// Add Checklist Item
templateRoutes.post("/templateAddChecklistItem", authenticateToken, templateNotDefaultCheck, subUserRestrictionAuthorization, TemplateAddChecklistItem);

// Delete Checklist Item
templateRoutes.patch("/templateDeleteChecklistItem", authenticateToken, templateNotDefaultCheck, subUserRestrictionAuthorization, TemplateDeleteChecklistItem);

// Re Arrange Rooms
templateRoutes.patch("/reArrangeRooms", authenticateToken, templateNotDefaultCheck, subUserRestrictionAuthorization, reArrangeRooms);

// Re Arrange Elements
templateRoutes.patch("/reArrangeElements", authenticateToken, templateNotDefaultCheck, subUserRestrictionAuthorization, reArrangeElements);

// Save Template As Draft
templateRoutes.patch("/saveTemplateAsDraft", authenticateToken, templateNotDefaultCheck, subUserRestrictionAuthorization, saveTemplateAsDraft);

// Save Template As Complete
templateRoutes.patch("/saveTemplateAsComplete", authenticateToken, templateNotDefaultCheck, subUserRestrictionAuthorization, saveTemplateAsComplete);

// Clone Inspection Template
templateRoutes.post("/cloneInspectionTemplate", authenticateToken, templateCreationTierLimitAuthorization, cloneInspectionTemplate);

// Delete Template
templateRoutes.delete("/deleteTemplate/:id", authenticateToken, templateNotDefaultCheck, subUserRestrictionAuthorization, deleteTemplate);

// Delete Question Template
templateRoutes.delete("/deleteSavedQuestion/:id", authenticateToken, subUserRestrictionAuthorization, deleteQuestionTemplate);