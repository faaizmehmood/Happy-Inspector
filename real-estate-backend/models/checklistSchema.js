import { Schema } from "mongoose";

const checklistSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["radio", "dropDown", "textArea"],
  },
  options: [{
    option: {
      type: String,
    },
    iconId: {
      type: String, // Icon ID for each option
    },
  }],
  answerRequired: {
    type: Boolean,
    default: true,
  },
});

export default checklistSchema;
