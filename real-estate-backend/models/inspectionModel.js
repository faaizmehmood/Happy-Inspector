import { Schema, model } from "mongoose";

const imageSchema = new Schema({

  publicId: {
    type: String,
    required: true,
  },

  url: {
    type: String,
  },

  caption: {
    type: String,
  },
});

const pdfReportSchema = new Schema({
  url: {
    type: String,
  },
  publicId: {
    type: String,
  },
  dateGenerated: {
    type: Date,
    default: Date.now,
  },
});

const checklistSchema = new Schema({
  text: {
    type: String,
  },
  type: {
    type: String,
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
  answer: {
    type: String,
  },
  answerRequired: {
    type: Boolean,
    default: true,
  },
});

const elementSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    url: { type: String },
    publicId: { type: String },
  },
  imageRequired: {
    type: Boolean,
    default: false,
  },
  note: {
    type: String,
  },
  checklist: [checklistSchema],
});

const roomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  imageRequired: {
    type: Boolean,
    default: false,
  },
  image: [imageSchema],
  note: {
    type: String,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  elements: [elementSchema],
});

// Apply validation to the image array inside rooms schema
roomSchema.path('image').validate(function(images) {
  return images.length <= 10;
}, 'You can upload a maximum of 10 images.');

const inspectionSchema = new Schema({
  template: {
    type: Schema.Types.ObjectId,
    ref: "InspectionTemplate",
    required: true,
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  fromScratch: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subUser: {
    type: Schema.Types.ObjectId,
    ref: "SubUser",
  },
  name: {
    type: String,
    required: true,
  },
  inspectionDate: {
    type: Date,
    default: Date.now,
  },
  isInspectionCompleted: {
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
  pdfReportGenerated: {
    type: Boolean,
    default: false,
  },
  pdfReportUrl: [pdfReportSchema],
  inspectorName: {
    type: String,
    required: true,
  },
  inspectorRole: {
    type: String,
    required: true,
  },
  inspectorSignature: {
    url: { type: String },
    publicId: { type: String}
  },
  collaborators: [{
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    shouldSendSignatureMail: {
      type: Boolean,
      default: false,
    },
    signatureNotRequired: {
      type: Boolean,
      default: false,
    },
    signature: {
      url: { type: String },
      publicId: { type: String}
    },
  }],
  completedAt: {
    type: Date,
  },
  rooms: [roomSchema],
}, {
  timestamps: true,
});

export default model("Inspection", inspectionSchema);
