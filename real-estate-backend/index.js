// Importing all the required modules
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

// Importing the routes
import { authRoutes } from "./routes/authRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
import { inspectionRoutes } from "./routes/inspectionRoutes.js";
import { noteRoutes } from "./routes/noteRoutes.js";
import { propertyRoutes } from "./routes/propertyRoutes.js";
import { templateRoutes } from "./routes/templateRoutes.js";
import { subUserRoutes } from "./routes/subUserRoutes.js";
import { superAdminRoutes } from "./routes/superAdminRoutes.js";
import { stripeWebhookRoutes } from "./routes/stripeWebhookRoutes.js";

import { pricingTierSetup } from "./controllers/setupController.js";
import scheduleCronJobs from "./jobs/cron-job.js";

// Configuring the environment variables
dotenv.config();

// Creating the express app
const app = express();

// Using the middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// allowed cors origins
const allowedOrigins = [
  "http://localhost:5173", // Web Frontend
  "http://192.168.18.5:8081", // Mobile Frontend
  "https://192.168.100.27:8081", // Mobile Frontend
  "https://192.168.100.55:8081", // Mobile Home Faaiz Frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.static(path.resolve("./public")));

// Using the routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/inspection", inspectionRoutes);
app.use("/api/note", noteRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/template", templateRoutes);
app.use("/api/subUser", subUserRoutes);
app.use("/api/admin", superAdminRoutes);
app.use("/api/handleStripeWebhooks", stripeWebhookRoutes);

// Connecting to the database and starting the server
mongoose
  .connect(process.env.MONGO_URL)
  .then(async() => {
    console.log("Connected to MongoDB!");

    await pricingTierSetup();
    scheduleCronJobs();
    
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("Failed to connect to MongoDB:", err));
