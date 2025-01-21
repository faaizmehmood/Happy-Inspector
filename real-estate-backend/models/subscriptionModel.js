import { Schema, model } from "mongoose";

const subscriptionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    pricingTier: {
        type: Schema.Types.ObjectId,
        ref: "Pricing",
        required: true
    },
    subscriptionType: {
        type: String,
        enum: ["MONTHLY", "YEARLY"],
        required: true,
    },
    externalId: {
        type: String, // e.g., Stripe subscription ID or RevenueCat subscriber ID
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isTrial: {
        type: Boolean,
        default: false,
    }
},
    { timestamps: true}
);

export default model("Subscription", subscriptionSchema);
