import { Schema, model } from "mongoose";

const otpSchema = new Schema({
    otp: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
    },
    expiry: {
        type: Date, // 2 minutes
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

export default model("OTP", otpSchema);
