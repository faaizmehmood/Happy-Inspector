import { Schema, model } from "mongoose";
import roomSchema from "./roomSchema.js";

const inspectionTemplateSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  isDraft: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  rooms: [roomSchema],
}, {
  timestamps: true,
});

export default model("InspectionTemplate", inspectionTemplateSchema);
