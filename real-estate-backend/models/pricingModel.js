import { Schema, model } from "mongoose";

const pricingSchema = new Schema({
    name: {
        type: String,
        enum: ["FREETIER", "STANDARDTIER", "TOPTIER"],
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    inspectionLimit: {
        type: Number,
        required: true,
    },
    templateLimit: {
        type: Number,
        required: true,
    },
    propertyLimit: {
        type: Number,
        required: true,
    },
    monthlyPDFLimit: {
        type: Number,
        required: true,
    },
    roomLimit: {
        type: Number,
        required: true,
    },
    elementLimit: {
        type: Number,
        required: true,
    },
    monthlyPrice: {
        type: Number,
        required: true,
    },
    yearlyPrice: {
        type: Number,
        required: true,
    },
    reportWatermark: {
        type: String,
    }
},
    { timestamps: true}
);

export default model("Pricing", pricingSchema);
