import { Router } from "express";
import { 
    getInspections, 
    createBasicInspectionDraft, 
    InspectionAddNewRoom,
    InspectionAddNewElement,
    InspectionAddNewChecklistItem,
    InspectionDeleteRoom,
    InspectionDeleteElement,
    InspectionDeleteChecklistItem,
    InspectionUpdateRoom,
    getSpecificInspection,
    saveInspectionDraft,
    getInspectionRoomData,
    reArrangeRooms,
    reArrangeElements,
    inspectionAddCollaborator,
    inspectionDeleteCollaborator,
    inspectionUpdateCollaborator,
    inspectionCompleteDraft,
    // saveInspectionSignature,
    generateInspectionPDF,
    reEditInspection,
    InspectionUpdateRoomImageCaption,
    getCompleteInspection,
    getReportGeneratedInspections,
    getInspectionsByPropertyId,
    TestAPI,
} from "../controllers/inspectionController.js";

import { 

    InspectionAddRoomImage,
    InspectionSaveElementImage,
    InspectionDeleteRoomImage,
    InspectionDeleteElementImage,
    finalizeInspection,
    saveCollaboratorSignatureFromEmail,
    saveSignatureDirectly
    
} from "../controllers/inspectionImageController.js";

// Importing the Middleware
import { authenticateToken } from "../middlewares/authenticateToken.js";
import upload from "../middlewares/imageUpload.js";

import { 

    inspectionCreationTierLimitAuthorization,
    pdfGenerationTierLimitAuthorization,
    subUserManagerExpiryAuthorization,
    inspectionRoomLimitAuthorization,
    inspectionElementLimitAuthorization,
    
 } from "../middlewares/authorization.js";

export const inspectionRoutes = Router();


//--------------------------------------------------------------*********************--------------------------------------------------------------
// INSPECTION ROUTES BELOW

// Create Basic Inspection Draft
inspectionRoutes.post("/createBasicInspectionDraft", authenticateToken, inspectionCreationTierLimitAuthorization, createBasicInspectionDraft);

// Get Inspections
inspectionRoutes.post("/getInspections", authenticateToken, subUserManagerExpiryAuthorization, getInspections);

// Add New Room
inspectionRoutes.post("/InspectionAddNewRoom", authenticateToken, subUserManagerExpiryAuthorization, inspectionRoomLimitAuthorization, InspectionAddNewRoom);

// Add New Element
inspectionRoutes.post("/InspectionAddNewElement", authenticateToken, subUserManagerExpiryAuthorization, inspectionElementLimitAuthorization, InspectionAddNewElement);

// Add New Checklist Item
inspectionRoutes.post("/InspectionAddNewChecklistItem", authenticateToken, subUserManagerExpiryAuthorization, InspectionAddNewChecklistItem);

// Delete Room
inspectionRoutes.post("/InspectionDeleteRoom", authenticateToken, subUserManagerExpiryAuthorization, InspectionDeleteRoom);

// Delete Element
inspectionRoutes.post("/InspectionDeleteElement", authenticateToken, subUserManagerExpiryAuthorization, InspectionDeleteElement);

// Delete Checklist Item
inspectionRoutes.post("/InspectionDeleteChecklistItem", authenticateToken, subUserManagerExpiryAuthorization, InspectionDeleteChecklistItem);

// Update Room
inspectionRoutes.post("/InspectionUpdateRoom", authenticateToken, subUserManagerExpiryAuthorization, InspectionUpdateRoom);

// Get Specific Inspection
inspectionRoutes.get("/getSpecificInspection/:id", authenticateToken, subUserManagerExpiryAuthorization, getSpecificInspection);

// Save Inspection Draft
inspectionRoutes.post("/saveInspectionDraft", authenticateToken, subUserManagerExpiryAuthorization, saveInspectionDraft);

// Get Inspection Room Data
inspectionRoutes.post("/getInspectionRoomData", authenticateToken, subUserManagerExpiryAuthorization, getInspectionRoomData);

// Re Arrange Rooms
inspectionRoutes.post("/reArrangeRooms", authenticateToken, subUserManagerExpiryAuthorization, reArrangeRooms);

// Re Arrange Elements
inspectionRoutes.post("/reArrangeElements", authenticateToken, subUserManagerExpiryAuthorization, reArrangeElements);

// Add Collaborator
inspectionRoutes.post("/inspectionAddCollaborator", authenticateToken, subUserManagerExpiryAuthorization, inspectionAddCollaborator);

// Delete Collaborator
inspectionRoutes.post("/inspectionDeleteCollaborator", authenticateToken, subUserManagerExpiryAuthorization, inspectionDeleteCollaborator);

// Update Collaborator
inspectionRoutes.post("/inspectionUpdateCollaborator", authenticateToken, subUserManagerExpiryAuthorization, inspectionUpdateCollaborator);

// Complete Inspection Draft
inspectionRoutes.post("/inspectionCompleteDraft", authenticateToken, subUserManagerExpiryAuthorization, inspectionCompleteDraft);

// Generate Inspection PDF (NEEED TO INCLUDE AUTHORIZATION)
inspectionRoutes.post("/generateInspectionPDF", authenticateToken, pdfGenerationTierLimitAuthorization, generateInspectionPDF);

// Re Edit Inspection
inspectionRoutes.post("/reEditInspection", authenticateToken, subUserManagerExpiryAuthorization, reEditInspection);

// Add Room Image
inspectionRoutes.post("/InspectionAddRoomImage", authenticateToken, subUserManagerExpiryAuthorization, upload, InspectionAddRoomImage);
// inspectionRoutes.post("/InspectionAddRoomImage", authenticateToken, InspectionAddRoomImage);

// Delete Room Image
inspectionRoutes.patch("/InspectionDeleteRoomImage", authenticateToken, subUserManagerExpiryAuthorization, InspectionDeleteRoomImage);

// Save Element Image
inspectionRoutes.post("/InspectionSaveElementImage", authenticateToken, subUserManagerExpiryAuthorization, upload, InspectionSaveElementImage);

// Delete Element Image
inspectionRoutes.patch("/InspectionDeleteElementImage", authenticateToken, subUserManagerExpiryAuthorization, InspectionDeleteElementImage);

// Update Room Image Caption
inspectionRoutes.patch("/InspectionUpdateRoomImageCaption", authenticateToken, subUserManagerExpiryAuthorization, InspectionUpdateRoomImageCaption);

// Get Complete Inspection
inspectionRoutes.get("/getCompleteInspection/:id", authenticateToken, subUserManagerExpiryAuthorization, getCompleteInspection);

// Get Inspections By Property Id
inspectionRoutes.get("/getInspectionsByPropertyId", authenticateToken, subUserManagerExpiryAuthorization, getInspectionsByPropertyId);

// Finalize Inspection
inspectionRoutes.post("/finalizeInspection", authenticateToken, subUserManagerExpiryAuthorization, finalizeInspection);

// Save Collaborator Signature From Email
inspectionRoutes.post("/saveCollaboratorSignature", authenticateToken, upload, saveCollaboratorSignatureFromEmail);

// Get Report Generated Inspections
inspectionRoutes.post("/getReportGeneratedInspections", authenticateToken, subUserManagerExpiryAuthorization, getReportGeneratedInspections);

// Save Signature Directly
inspectionRoutes.post("/saveSignatureDirectly", authenticateToken, subUserManagerExpiryAuthorization, upload, saveSignatureDirectly);

// Test API
inspectionRoutes.post("/testAPI", authenticateToken, TestAPI);