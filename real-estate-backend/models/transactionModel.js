import { Schema, model } from "mongoose";

const transactionSchema = new Schema({
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
    paymentMethod: {
        type: String,
        enum: ['CREDIT_CARD', 'APPLE_PAY', 'GOOGLE_PAY', 'N/A'],
        required: true,
    },
    transactionId: {
        type: String, // e.g., Stripe charge ID
    },
    transactionType: {
        type: String,
        enum: ['SUBSCRIPTION', 'FREETRIAL', 'RENEWAL', 'CANCELLATION'], 
        required: true,
    },
    amount: {
        type: Number,
        required: false,
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        required: false,
    },
},
    { timestamps: true}
);

export default model("Transaction", transactionSchema);
