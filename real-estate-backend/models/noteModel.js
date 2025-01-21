import { Schema, model } from "mongoose";

const noteSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    notes: [{
        type: String,
        required: true,
    }],
    }, {
    timestamps: true,
});

export default model("Notes", noteSchema);
