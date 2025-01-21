import { Router } from "express";
import { createDefaultQuestionTemplate, createCustomQuestionTemplate } from "../controllers/questionTemplateController.js";
import { createPresetNote } from "../controllers/presetNotesController.js";

// Importing the Middleware
import { authenticateToken } from "../middlewares/authenticateToken.js";

export const noteRoutes = Router();

// Create Preset Note
noteRoutes.post("/createPresetNote", createPresetNote);

// Create Default Question Template
noteRoutes.post("/createDefaultQuestionTemplate", createDefaultQuestionTemplate);

// Create Custom Question Template
noteRoutes.post("/createCustomQuestionTemplate", authenticateToken, createCustomQuestionTemplate);