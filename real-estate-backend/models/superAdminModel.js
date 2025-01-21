import { Schema, model } from "mongoose";
import { randomBytes, createHmac } from "crypto";
import { createTokensForUser } from "../services/auth.js";

const superAdminSchema = new Schema(
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
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["superAdmin"],
      default: "superAdmin",
    },
    salt: {
      type: String,
    },
  },
  { timestamps: true }
);
// Runs before saving the user to the database
superAdminSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

// Static method to match password and generate token
superAdminSchema.static(
  "matchPasswordAndGenerateTokens",
  async function (email, password, deviceType) {
    const user = await this.findOne({ email });
    if (!user) return {user: null, accessToken: null, status: false, message: "Invalid Email!"};

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
      message: "Super Admin Authenticated!"
    };
  }
);

export default model("superAdmin", superAdminSchema);
