import userModel from "../models/userModel.js";
import subUserModel from "../models/subUserModel.js";
import otpModel from "../models/otpModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  forgotPasswordValidation,
  loginValidation,
  verfiyPasswordResetOTPValidation,
  resetPasswordValidation,
  createSignupOTP,
  createUserAccountValidation,
} from "../services/formValidation.js";
import { createTokensForUser } from "../services/auth.js";
import { generateOTP } from "../services/generateOTP.js";
import { sendOtpMail } from "../services/sendOtpMail.js";
dotenv.config();

// Validate user input data, generate OTP and send OTP to user's email address
export const createOtpForSignup = async (req, res) => {
  const { email } = req.body;

  // Validate user input data using joi schema
  const { error } = createSignupOTP(req.body);

  if (error) {
    return res.status(400).send({
      message: error.details[0].message,
    });
  }
  // If user input data is valid, proceed to register user
  try {
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists!" });
    } else {
      // Generate OTP
      const otp = generateOTP();

      // Save OTP to database
      const otpData = await otpModel.create({
        email,
        otp,
        expiry: new Date(Date.now() + 2 * 60 * 1000 + 10 * 1000),
        createdAt: new Date(Date.now()),
      });

      // Send OTP to user's email address
      await sendOtpMail(email, otp);

      return res.status(200).json({
        message: "OTP sent to your email address!",
        otpExpiry: otpData.expiry,
        otpId: otpData._id,
      });
    }
  } catch (err) {
    return res.status(400).send({
      message: "User Registration Failed!",
      error: err.message,
    });
  }
};

// Verify OTP and register user
export const createUserAccount = async (req, res) => {
  const body = req.body;

  // console.log("signupType", body.signupType);

  const validationValues = {
    fullname: body.fullname,
    email: body.email,
    password: body.password,
    signupType: body.signupType,
    userEnteredOTP: body.userEnteredOTP,
  };

  // Validate user input data using joi schema
  // const { error } = createUserAccountValidation(validationValues);

  // if (error) {
  //   return res.status(400).send({
  //     message: error.details[0].message,
  //   });
  // }

  const { fullname, email, password, otpId, userEnteredOTP, deviceType } = req.body;

  try {
    const otpResponse = await otpModel.findById(otpId);

    // Check if OTP exists
    if (!otpResponse) {
      return res.status(400).send({
        message: "OTP not found!",
      });
    }

    // Check if OTP entered by user is correct as per the one stored in database
    if (otpResponse.otp !== userEnteredOTP) {
      return res.status(400).send({
        message: "Invalid OTP!",
      });
    }

    // Check if OTP has expired
    const currentTime = new Date();
    const otpExpiry = new Date(otpResponse.expiry);
    if (currentTime > otpExpiry) {
      return res.status(400).send({
        message: "OTP has expired!",
      });
    }

    const user = await userModel.create({
      fullname,
      email,
      password,
      signupType: body.signupType,
      otpVerified: true,
      propertyCategories: [
        {
          value: "Residential",
          iconId: "2"
        },
        {
          value: "Commercial",
          iconId: "5"
        }
      ],
    });

    // Delete OTP from database
    await otpModel.findByIdAndDelete(otpResponse._id);

    const { accessToken } = createTokensForUser(user, deviceType);
  
    res.cookie("accessToken", accessToken);

    return res.status(201).json({
      message: "User Registered Successfully!",
      userEmail: user.email,
      userData: { ...user["_doc"] }
    });
  } catch (err) {
    return res.status(400).send({
      message: "OTP Verification Failed!",
      error: err.message,
    });
  }
};

// Login user and generate access token
export const login = async (req, res) => {
  // console.log("Login request received", req.body);
  // Validate user input data using joi schema
  const { error } = loginValidation(req.body);

  if (error) {
    console.log("Login validation error", error);
    return res.status(400).send({
      message: error.details[0].message,
    });
  }
  // If user input data is valid, proceed to login
  // Destructure email and password from req.body
  const { email, password, deviceType } = req.body;

  // console.log("Email and password", email, password);

  try {
    const resData = await userModel.matchPasswordAndGenerateTokens(
      email,
      password,
      deviceType
    );

    const { user, accessToken, status, message } = resData;
    if(status == true)
    {
      res.cookie("accessToken", accessToken);
      return res.status(200).json({
        message,
        userData: {
          ...user["_doc"],
          salt: undefined,
          password: undefined,
        },
      });
    }
    else
    {
      if(message == "User not found!")
      {
        const SubUserResData = await subUserModel.matchPasswordAndGenerateTokens(
          email,
          password,
          deviceType
        );
        const { subUser, subUseraccessToken, subUserstatus, subUsermessage } = SubUserResData;

        if(subUserstatus == true)
        {
          res.cookie("accessToken", subUseraccessToken);
          return res.status(200).json({
            subUsermessage,
            userData: {
              ...subUser["_doc"],
              salt: undefined,
              password: undefined,
            },
          });
        }
        else
        {
          if (message == "User not found!" )
          {
            return res.status(400).send({
              message: subUsermessage
            })
          }
          else
          {
            return res.status(400).send({
              message: message
            })
          }
          
        }

      }
      else
      {
        return res.status(400).send({
          message: message
        })
      }

    }
    // res.cookie("accessToken", accessToken);
    // return res.status(200).json({
    //   message: "User Authenticated!",
    //   userData: { ...user["_doc"] },
    // });
  } catch (err) {
    return res.status(400).send({
      message: "Incorrect Email or Password",
      error: err.message,
    });
  }
};

//Login user with Google
export const loginSignupWithGoogle = async (req, res) => {
  const { fullname, email, type, deviceType } = req.body;

  if (type !== "google" && type !== "facebook") {
    return res.status(400).send({
      message: "Invalid user type!",
    });
  }

  // Check if user exists
  const userExists = await userModel.findOne({ email });

  // If user exists, generate access token
  if (userExists) {
    const { accessToken } = createTokensForUser(userExists, deviceType);

    res.cookie("accessToken", accessToken);
    return res.status(200).json({
      message: "User Authenticated!",
      userData: { ...userExists["_doc"] },
    });
  }

  // If user does not exist, create a new user account
  try {
    const user = await userModel.create({
      fullname,
      email,
      signupType:type,
      otpVerified: true,
      propertyCategories: [
        {
          value: "Residential",
          iconId: "2"
        },
        {
          value: "Commercial",
          iconId: "5"
        }
      ],
    });

    const { accessToken } = createTokensForUser(user, deviceType);

    res.cookie("accessToken", accessToken);
    return res.status(200).json({
      message: "User Authenticated!",
      userData: { ...user["_doc"] },
    });
  } catch (err) {
    return res.status(400).send({
      message: "User Registration Failed!",
      error: err.message,
    });
  }
};

// Logout user by clearing access token cookie
export const logout = (req, res) => {
  try {
    res.cookie("accessToken", "", { maxAge: 1 });
    res.status(200).send({ message: "Logged out" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).send({ error: "Logout failed" });
  }
};

// Check if user is authenticated and send user data
export const checkAuthStatus = async (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.json({ isAuthenticated: false, role: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await userModel.findById(decoded._id);
    const subUser = await subUserModel.findById(decoded._id);

    const actualUser = user ? user : subUser;

    if (actualUser ) {
      return res.send({ isAuthenticated: true, userData: user ? {
        ...user["_doc"],
        salt: undefined,
        password: undefined,
      } : {
        ...subUser["_doc"],
        salt: undefined,
        password: undefined,
      } });
    } else {
      return res.send({ isAuthenticated: false, role: null });
    }
  } catch (err) {
    return res.status(400).send({ isAuthenticated: false, role: null });
  }
};

// Forgot password - Send OTP to user's email address after verifying email
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Validate user input data using joi schema
  const { error } = forgotPasswordValidation(req.body);
  if (error) {
    return res.status(400).send({
      message: error.details[0].message,
    });
  }

  try {
    let user;

    // Check if user exists
    user = await userModel.findOne({ email });

    if (!user) {
      user = await subUserModel.findOne({ email });

      if (!user) {
        return res.status(400).send({
          message: "User not found!",
        });
      }
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to database
    const otpData = await otpModel.create({
      email,
      otp,
      expiry: new Date(Date.now() + 2 * 60 * 1000 + 10 * 1000),
      createdAt: new Date(Date.now()),
    });

    // Send OTP to user's email address
    await sendOtpMail(email, otp);

    return res.status(200).json({
      message: "OTP sent to your email address!",
      otpExpiry: otpData.expiry,
      otpId: otpData._id,
    });
  } catch (err) {
    return res.status(400).send({
      message: "Forgot Password Failed!",
      error: err.message,
    });
  }
};

// Resend OTP to user's email address
export const resendOTPCode = async (req, res) => {
  //Get otpId
  const { otpId } = req.body;
  try {
    //Check if OTP exists
    const otpResponse = await otpModel.findById(otpId);
    if (!otpResponse) {
      return res.status(400).send({
        message: "OTP not found!",
      });
    }

    //delete existing OTP from database
    await otpModel.findByIdAndDelete(otpResponse._id);

    //Generate new OTP
    const newOTP = generateOTP();

    //Save new OTP to database
    const updatedOTP = await otpModel.create({
      email: otpResponse.email,
      otp: newOTP,
      expiry: new Date(Date.now() + 2 * 60 * 1000 + 10 * 1000),
      createdAt: new Date(Date.now()),
    });

    //Send new OTP to user's email address
    await sendOtpMail(otpResponse.email, newOTP);

    //Send response back to front-end
    return res.status(200).json({
      message: "OTP sent to your email address!",
      otpExpiry: updatedOTP.expiry,
      otpId: updatedOTP._id,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Resend OTP failed", error: err.message });
  }
};

// Verify OTP for password reset
export const verfiyPasswordResetOTP = async (req, res) => {
  const validationValues = {
    userEnteredOTP: req.body.userEnteredOTP,
  };

  const { error } = verfiyPasswordResetOTPValidation(validationValues);

  if (error) {
    return res.status(400).send({
      message: error.details[0].message,
    });
  }

  const { otpId, userEnteredOTP } = req.body;

  try {
    const otpResponse = await otpModel.findById(otpId);

    // Check if OTP exists
    if (!otpResponse) {
      return res.status(400).send({
        message: "OTP not found!",
      });
    }

    // Check if OTP entered by user is correct as per the one stored in database
    if (otpResponse.otp !== userEnteredOTP) {
      return res.status(400).send({
        message: "Invalid OTP!",
      });
    }

    let user;

    // Check if user exists
    user = await userModel.findOne({ email: otpResponse.email });

    if (user) {
      user.changePasswordEligible = true;
    }
    else
    {
      user = await subUserModel.findOne({ email: otpResponse.email });

      if (user) {
        user.changePasswordEligible = true;
      }
    }

    await user.save();
    // Check if OTP has expired
    // const currentTime = new Date();
    // const otpExpiry = new Date(otpResponse.expiry);
    // if (currentTime > otpExpiry) {
    //   return res.status(400).send({
    //     message: "OTP has expired!",
    //   });
    // }

    // Delete OTP from database
    await otpModel.findByIdAndDelete(otpResponse._id);

    return res.status(201).json({
      message: "OTP Verified Successfully!",
    });
  } catch (err) {
    return res.status(400).send({
      message: "OTP Verification Failed!",
      error: err.message,
    });
  }
};

// Reset password - Verify OTP and update user's password
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const { error } = resetPasswordValidation(req.body);

  if (error) {
    return res.status(400).send({
      message: error.details[0].message,
    });
  }

  try {
    // Check if user exists
    let user;

    user = await userModel.findOne({ email });

    if (!user) {
      user = await subUserModel.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found!" });
      }
    }

    // Check if otpVerified is true
    if (!user.changePasswordEligible) {
      return res.status(400).json({ message: "OTP not verified!" });
    }

    // Update user's password and save to database
    user.changePasswordEligible = false;
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successful!" });
  } catch (err) {
    return res.status(400).send({
      message: "Reset Password Failed!",
      error: err.message,
    });
  }
};
