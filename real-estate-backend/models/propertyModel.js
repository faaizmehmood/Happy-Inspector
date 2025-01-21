import { Schema, model } from "mongoose";

const addressSchema = new Schema({
  unit: {
    type: String,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});


const propertySchema = new Schema({
  owner: {
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
  isDeleted: {
    type: Boolean,
    default: false,
  },
  referenceId: {
    type: String,
    unique: true,
    required: true,
  },
  isIDGenerated: {
    type: Boolean,
    default: false
  },
  category: {
    value: {type: String},
    iconId: {type: String}
  },
  address: {
    type: addressSchema,
    required: true,
  },
  image: {
    url: { type: String },
    publicId: { type: String}
  },
  // Additional fields as needed
}, {
  timestamps: true,
});

export default model("Property", propertySchema);
