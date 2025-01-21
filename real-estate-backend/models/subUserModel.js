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

const subUserSchema = new Schema(
  {
    manager: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
        type: String,
        default: "",
    },
    password: {
      type: String,
    },
    phoneNumber: {
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
    role: {
      type: String,
      enum: ["SUBUSER"],
      default: "SUBUSER",
    },
    assignedCategories: [propertyCategory],
    canInspectFromScratch: {
        type: Boolean,
        default: false,
    },
    canCreateInspectionQuestions: {
        type: Boolean,
        default: false,
    },
    lastOnline: {
        type: Date,
        default: Date.now,
    },
    changePasswordEligible: {
      type: Boolean,
      default: false,
    },
    salt: {
      type: String,
    },
  },
  { timestamps: true }
);
// Runs before saving the user to the database
subUserSchema.pre("save", function (next) {
  const user = this;

  // Only hash the password if it's new or modified
  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.salt = salt;
  user.password = hashedPassword;
  next();
});


// Static method to match password and generate token
subUserSchema.static(
  "matchPasswordAndGenerateTokens",
  async function (email, password, deviceType) {
    const user = await this.findOne({ email });
    if (!user) return {subUser: null, subUseraccessToken: null, subUserstatus: false, subUsermessage: "User not found!"};

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== userProvidedHash)
    return {subUseruser: null, subUseraccessToken: null, subUserstatus: false, subUsermessage: "Incorrect Password!"};
    // Create token for user and saves it to the cookies of user
    const { accessToken } = createTokensForUser(user, deviceType);
    return {
      subUser: user,
      subUseraccessToken: accessToken,
      subUserstatus: true,
      subUsermessage: "Sub User Authenticated!"
    };
  }
);

export default model("SubUser", subUserSchema);
