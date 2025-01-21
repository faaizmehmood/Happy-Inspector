import { Schema, model } from "mongoose";

const userActivitySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    subUser: {
        type: Schema.Types.ObjectId,
        ref: "SubUser",
    },
    activity: {
        type: String,
        required: true,
    },
    subActivity: {
        type: String,
    },
    userRead: {
        type: Boolean,
        default: false,
    },
    subUserRead: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
},
{
    timestamps: true,
});

export default model("UserActivity", userActivitySchema);