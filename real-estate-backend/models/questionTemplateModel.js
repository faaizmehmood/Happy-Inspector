import { Schema, model } from "mongoose";

const questionTemplateModel = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  subUser: {
    type: Schema.Types.ObjectId,
    ref: "SubUser",
  },
  isdefault: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    required: true,
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
  type: {
    type: String,
    enum: ["radio", "dropDown", "textArea"],
  },
  answer: {
    type: String,
  },
});

export default model("Question", questionTemplateModel);