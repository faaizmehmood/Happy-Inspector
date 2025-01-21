import { Router } from "express";
import bodyParser from "body-parser";

import { handleWebHooks } from "../controllers/paymentWebHookController.js";

export const stripeWebhookRoutes = Router();


// ------------------------------------------
// Webhook Routes
// ------------------------------------------

// Login
stripeWebhookRoutes.post("/webhook", bodyParser.raw({ type: "application/json" }), handleWebHooks);