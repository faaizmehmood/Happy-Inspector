import { Schema } from "mongoose";
import roomElementSchema from "./roomElementSchema.js";

const roomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  elements: [roomElementSchema],
  imageRequired: {
    type: Boolean,
    default: false,
  }
});

export default roomSchema;
