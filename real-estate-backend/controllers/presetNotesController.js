import noteModel from "../models/noteModel.js";

// Create Preset Note
export const createPresetNote = async (req, res) => {
    const { title, notes } = req.body;

    try {
        const newPresetNote = await noteModel.create({
            title,
            notes,
        });

        return res.status(201).send({
            message: "Preset note created successfully!",
            presetNote: newPresetNote,
        });
    } catch (err) {
        return res.status(400).send({
            message: "Failed to create preset note!",
            error: err.message,
        });
    }
};