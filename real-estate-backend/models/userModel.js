import { Schema, model } from "mongoose";
import { randomBytes, createHmac } from "crypto";
import { createTokensForUser } from "../services/auth.js";

const propertyCategory = new Schema({
  value: {
    type: String,
  },
  iconId: {
    type: String, 
  },
});

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    signupType: {
      type: String,
      enum: ["google", "facebook", "normal"],
      required: true,
    },
    password: {
      type: String,
    },
    otpVerified: {
      type: Boolean,
    },
    personalPhoneNumber: {
      type: String,
      default: "",
    },
    profilePicture: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    businessName: {
      type: String,
      default: "",
    },
    businessAddress: {
      type: String,
      default: "",
    },
    businessPhoneNumber: {
      type: String,
      default: "",
    },
    businessWebsite: {
      type: String,
      default: "",
    },
    businessLogo: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    pdfIntro: {
      type: String,
      default: "",
    },
    pdfOutro: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["FREETIER", "STANDARDTIER", "TOPTIER"],
      default: "FREETIER",
    },
    changePasswordEligible: {
      type: Boolean,
      default: false,
    },
    propertyCategories: [propertyCategory],
    salt: {
      type: String,
    },
  },
  { timestamps: true }
);
// Runs before saving the user to the database
userSchema.pre("save", function (next) {
  // console.log("Pre-save hook triggered");
  const user = this;

  if (!user.isModified("password")) {
    // console.log("Password not modified, skipping hashing");
    return next();
  }

  // console.log("Hashing password...");
  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  // console.log("Password hashed successfully");
  next();
});

// Static method to match password and generate token
userSchema.static(
  "matchPasswordAndGenerateTokens",
  async function (email, password, deviceType) {
    const user = await this.findOne({ email });
    if (!user) return {user: null, accessToken: null, status: false, message: "User not found!"};

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== userProvidedHash)
      return {user: null, accessToken: null, status: false, message: "Incorrect Password!"};
    // Create token for user and saves it to the cookies of user
    const { accessToken } = createTokensForUser(user, deviceType);
    return {
      user,
      accessToken,
      status: true,
      message: "User Authenticated!"
    };
  }
);

export default model("User", userSchema);
