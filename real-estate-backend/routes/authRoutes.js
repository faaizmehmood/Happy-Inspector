import { Router } from "express";
import {
  createOtpForSignup,
  createUserAccount,
  login,
  loginSignupWithGoogle,
  logout,
  checkAuthStatus,
  resendOTPCode,
  forgotPassword,
  resetPassword,
  verfiyPasswordResetOTP,
} from "../controllers/authController.js";

export const authRoutes = Router();

// Account Registration
authRoutes.post("/createSignupOTP", createOtpForSignup);
authRoutes.post("/createUserAccount", createUserAccount);

// Account Login
authRoutes.post("/login", login);
authRoutes.post("/loginSignupWithGoogle", loginSignupWithGoogle);

// Account Logout
authRoutes.get("/logout", logout);

// Account Authentication Status
authRoutes.get("/status", checkAuthStatus);

// Account Recovery
authRoutes.post("/forgotPassword", forgotPassword);
authRoutes.post("/resendOTP", resendOTPCode);
authRoutes.post("/verfiyPasswordResetOTP", verfiyPasswordResetOTP);
authRoutes.post("/resetPassword", resetPassword);
