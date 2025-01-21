import { Schema } from "mongoose";
import checklistSchema from "./checklistSchema.js";

const roomElementSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  imageRequired: {
    type: Boolean,
    default: false,
  },
  checklist: [checklistSchema],
});

export default roomElementSchema;
