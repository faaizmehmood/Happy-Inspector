import fs from 'fs';
import path from 'path';
import inspectionModel from "../models/inspectionModel.js";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../services/imageService.js';
import { sendCollaboratorMail, sendInspectorNewCollaboratorSignatureMail } from '../services/signatureMailing.js';
import { pdfEligibilityOrAllSigned } from '../services/pdfEligibility.js';
import userModel from '../models/userModel.js';
import subUserModel from '../models/subUserModel.js';
import userActivityModel from '../models/userActivityModel.js';
import propertyModel from '../models/propertyModel.js';

//Upload Room Image
export const InspectionAddRoomImage = async (req, res) => {
    const { inspectionId, roomId } = req.body;

    try {
        if (!req.file) {
            console.log('req.file', req.file)
            return res.status(500).send({
                message: "No image uploaded!",
            });
        }


        const inspection = await inspectionModel.findById(inspectionId).populate('property');
        if (!inspection) {
            return res.status(400).send({
                message: "Inspection not found!",
            });
        }

        const room = inspection.rooms.id(roomId);
        if (!room) {
            return res.status(400).send({
                message: "Room not found!",
            });
        }

        //check if room Images are less than 10
        if (room.image.length >= 10) {
            return res.status(400).send({
                message: "Room images limit reached!",
            });
        }

        const uploadedImage = await uploadImageToCloudinary(req.file.path, `${inspection.user.toString()}/${inspection.property._id.toString()}`);

        // Delete the local file after successful upload
        fs.unlinkSync(req.file.path);


        room.image.push({
            publicId: uploadedImage.public_id,
            url: uploadedImage.url,
            caption: "",
        });

        await inspection.save();

        return res.status(201).send({
            message: "Room image added successfully!",
            newImage: room.image[room.image.length - 1],
        });
    }
    catch (err) {

        // Optionally delete the file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(400).send({
            message: "Failed to add room image!",
            error: err.message,
        });
    }
}

//Upload Element Image
export const InspectionSaveElementImage = async (req, res) => {

    const { inspectionId, roomId, elementId, image } = req.body;

    try {
        const inspection = await inspectionModel.findById(inspectionId).populate('property');
        if (!inspection) {
            return res.status(400).send({
                message: "Inspection not found!",
            });
        }

        const room = inspection.rooms.id(roomId);
        if (!room) {
            return res.status(400).send({
                message: "Room not found!",
            });
        }

        const element = room.elements.id(elementId);
        if (!element) {
            return res.status(400).send({
                message: "Element not found!",
            });
        }

        const checkImageExists = element.image;
        if (checkImageExists) {
            if (checkImageExists.url) {
                await deleteImageFromCloudinary(checkImageExists.publicId);
            }
        }

        const uploadedImage = await uploadImageToCloudinary(req.file.path, `${inspection.user.toString()}/${inspection.property._id.toString()}`);

        // Delete the local file after successful upload
        fs.unlinkSync(req.file.path);

        element.image.url = uploadedImage.url;
        element.image.publicId = uploadedImage.public_id;

        await inspection.save();

        return res.status(201).send({
            message: "Element image saved successfully!",
            newImage: element.image,
        });
    }
    catch (err) {

        // Optionally delete the file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(400).send({
            message: "Failed to save element image!",
            error: err.message,
        });
    }
}

//Delete Room Image
export const InspectionDeleteRoomImage = async (req, res) => {
    const { inspectionId, roomId, imageId } = req.body;

    try {
        const inspection = await inspectionModel.findById(inspectionId);
        if (!inspection) {
            return res.status(400).send({
                message: "Inspection not found!",
            });
        }

        const room = inspection.rooms.id(roomId);
        if (!room) {
            return res.status(400).send({
                message: "Room not found!",
            });
        }

        const image = room.image.id(imageId);
        if (!image) {
            return res.status(400).send({
                message: "Image not found!",
            });
        }

        if (image.url) {
            await deleteImageFromCloudinary(image.publicId);
        }

        image.deleteOne({ _id: imageId });

        await inspection.save();

        return res.status(201).send({
            message: "Room image deleted successfully!",
        });
    }
    catch (err) {
        return res.status(400).send({
            message: "Failed to delete room image!",
            error: err.message,
        });
    }
}

//Delete Element Image
export const InspectionDeleteElementImage = async (req, res) => {
    const { inspectionId, roomId, elementId } = req.body;

    try {
        const inspection = await inspectionModel.findById(inspectionId);
        if (!inspection) {
            return res.status(400).send({
                message: "Inspection not found!",
            });
        }

        const room = inspection.rooms.id(roomId);
        if (!room) {
            return res.status(400).send({
                message: "Room not found!",
            });
        }

        const element = room.elements.id(elementId);
        if (!element) {
            return res.status(400).send({
                message: "Element not found!",
            });
        }

        const image = element.image;
        if (image) {
            await deleteImageFromCloudinary(image.publicId);
        }

        element.image.url = "";
        element.image.publicId = "";


        await inspection.save();

        return res.status(201).send({
            message: "Element image deleted successfully!",
        });
    }
    catch (err) {
        return res.status(400).send({
            message: "Failed to delete element image!",
            error: err.message,
        });
    }
}

export const finalizeInspection = async (req, res) => {
    const { inspectionId, reportData, inspectorData } = req.body;

    try {
        const { propertyId, reportName, inspectionDate } = reportData;
        const { inspectorName, inspectorRole } = inspectorData;

        //console log everything
        // console.log("Inspection ID: ", inspectionId);
        // console.log("Property ID: ", propertyId);
        // console.log("Report Name: ", reportName);
        // console.log("Inspection Date: ", inspectionDate);
        // console.log("Inspector Name: ", inspectorName);
        // console.log("Inspector Role: ", inspectorRole);

        const inspection = await inspectionModel.findById(inspectionId).populate("property");
        if (!inspection) {
            return res.status(400).send({
                message: "Inspection not found!",
            });
        }

        const propertyData = await propertyModel.findById(propertyId);
        if (!propertyData) {
            return res.status(400).send({
                message: "Property not found!",
            });
        }

        for (const collaborator of inspection.collaborators) {

            if (collaborator.shouldSendSignatureMail == true && collaborator.signatureNotRequired == false) {
                await sendCollaboratorMail(collaborator.email, collaborator._id, inspection.inspectorName, inspection._id);
            }
        }


        inspection.name = reportName;
        inspection.property = propertyData._id;
        inspection.inspectionDate = inspectionDate;
        inspection.inspectorName = inspectorName;
        inspection.inspectorRole = inspectorRole;

        const result = pdfEligibilityOrAllSigned(inspection);

        if (result == "true") {
            inspection.isInspectionCompleted = true;
        }

        inspection.isDraft = false;

        await inspection.save();

        if (inspection.subUser) {
            const subUser = await subUserModel.findById(inspection.subUser);
            if (!subUser) {
                return res.status(400).send({
                    message: "Sub User not found!",
                });
            }

            await userActivityModel.create({
                user: inspection.user,
                subUser: inspection.subUser,
                activity: `Sub User ${subUser.fullname} has finalized the inspection, ${inspection.name}`,
                subActivity: `You have finalized the inspection, ${inspection.name}`,
            });
        }
        else {
            await userActivityModel.create({
                user: inspection.user,
                activity: `You have finalized the inspection, ${inspection.name}`,
            });
        }

        return res.status(201).send({
            message: "Inspection finalized successfully!",
        });
    }
    catch (err) {
        return res.status(400).send({
            message: "Failed to finalize inspection!",
            error: err.message,
        });
    }
}

export const saveCollaboratorSignatureFromEmail = async (req, res) => {
    const { inspectionId } = req.body;

    try {
        const { id } = req.user;

        if (!req.file) {
            return res.status(500).send({
                message: "No image uploaded!",
            });
        }

        const inspection = await inspectionModel.findById(inspectionId).populate("property");
        if (!inspection) {
            return res.status(400).send({
                message: "Inspection not found!",
            });
        }

        const collaborator = inspection.collaborators.find(collaborator => collaborator._id == id);

        if (!collaborator) {
            return res.status(400).send({
                message: "Collaborator not found!",
            });
        }

        if (collaborator.signature) {
            if (collaborator.signature.url && collaborator.signature.url !== "") {
                return res.status(400).send({
                    message: "Collaborator has already signed!",
                })
            }
        }

        //update the collaborator signature
        const uploadedSignature = await uploadImageToCloudinary(req.file.path, `${inspection.user.toString()}/${inspection.property._id.toString()}`);

        collaborator.signature = {
            url: uploadedSignature.url,
            publicId: uploadedSignature.public_id
        };

        // Clean up the file after uploading
        fs.unlinkSync(req.file.path);

        const result = pdfEligibilityOrAllSigned(inspection);

        if (result == "true") {
            inspection.isInspectionCompleted = true;
        }

        inspection.isDraft = false;

        await inspection.save();

        //send email to inspector that a collaborator has signed
        await sendInspectorNewCollaboratorSignatureMail(inspectorData.email, inspectorData.name, collaborator.name, inspection.name);

        if (inspection.subUser) {
            const subUser = await subUserModel.findById(inspection.subUser);
            if (!subUser) {
                return res.status(400).send({
                    message: "Sub User not found!",
                });
            }

            await userActivityModel.create({
                user: inspection.user,
                subUser: inspection.subUser,
                activity: `Collaborator ${collaborator.name}'s signature saved for inspection, ${inspection.name}`,
                subActivity: `Collaborator ${collaborator.name}'s signature saved for inspection, ${inspection.name}`,
            });
        }
        else {
            await userActivityModel.create({
                user: inspection.user,
                activity: `Collaborator ${collaborator.name}'s signature saved for inspection, ${inspection.name}`,
            });
        }

        return res.status(201).send({
            message: "Collaborator signature saved successfully!",
            signatureURL: collaborator.signature.url
        });



    }
    catch (err) {
        return res.status(400).send({
            message: "Failed to save collaborator signature From Email!",
            error: err.message,
        });
    }
}


export const saveSignatureDirectly = async (req, res) => {
    const { inspectionId, collaboratorId, isInspector } = req.body;

    try {
        // console.log("Inspection ID: ", inspectionId);
        // console.log("Collaborator ID: ", collaboratorId);
        // console.log("Is Inspector: ", isInspector);
        // console.log("Signature File: ", req.file);

        // console.log("Type of Is Inspector: ", typeof isInspector);

        if (!req.file) {
            return res.status(500).send({
                message: "No image uploaded!",
            });
        }

        const inspection = await inspectionModel.findById(inspectionId).populate('property');
        if (!inspection) {
            return res.status(400).send({
                message: "Inspection not found!",
            });
        }

        if (isInspector == "true") {
            if (inspection.inspectorSignature) {
                if (inspection.inspectorSignature.url && inspection.inspectorSignature.url !== "") {
                    await deleteImageFromCloudinary(inspection.inspectorSignature.publicId);

                    inspection.inspectorSignature = { url: "", publicId: "" };
                }
            }

            //update the inspector signature
            const uploadedSignature = await uploadImageToCloudinary(req.file.path, `${inspection.user.toString()}/${inspection.property._id.toString()}`);

            inspection.inspectorSignature = {
                url: uploadedSignature.url,
                publicId: uploadedSignature.public_id
            };

            await inspection.save();

            if (inspection.subUser) {
                const subUser = await subUserModel.findById(inspection.subUser);
                if (!subUser) {
                    return res.status(400).send({
                        message: "Sub User not found!",
                    });
                }

                return res.status(201).send({
                    message: "Inspector signature saved successfully!",
                    signatureURL: inspection.inspectorSignature.url
                });
            }
            else {
                await userActivityModel.create({
                    user: inspection.user,
                    activity: `You saved the inspector signature for inspection, ${inspection.name}`,
                });
            }

            // Clean up the file after uploading
            fs.unlinkSync(req.file.path);

            return res.status(201).send({
                message: "Inspector signature saved successfully!",
                signatureURL: inspection.inspectorSignature.url
            });
        }
        else {
            const collaborator = inspection.collaborators.find(collaborator => collaborator._id == collaboratorId);

            if (!collaborator) {
                return res.status(400).send({
                    message: "Collaborator not found!",
                });
            }

            if (collaborator.signature) {
                if (collaborator.signature.url && collaborator.signature.url !== "") {
                    await deleteImageFromCloudinary(collaborator.signature.publicId);

                    //unset the collaborator.signature from the mongodb
                    inspection.collaborators.id(collaboratorId).signature = { url: "", publicId: "" };
                }
            }

            //update the collaborator signature
            const uploadedSignature = await uploadImageToCloudinary(req.file.path, `${inspection.user.toString()}/${inspection.property._id.toString()}`);

            collaborator.signature = {
                url: uploadedSignature.url,
                publicId: uploadedSignature.public_id
            };

            await inspection.save();

            if (inspection.subUser) {
                const subUser = await subUserModel.findById(inspection.subUser);
                if (!subUser) {
                    return res.status(400).send({
                        message: "Sub User not found!",
                    });
                }

                await userActivityModel.create({
                    user: inspection.user,
                    subUser: inspection.subUser,
                    activity: `Collaborator ${collaborator.name}'s signature saved for inspection, ${inspection.name}`,
                    subActivity: `Collaborator ${collaborator.name}'s signature saved for inspection, ${inspection.name}`,
                });
            }
            else {
                await userActivityModel.create({
                    user: inspection.user,
                    activity: `Collaborator ${collaborator.name}'s signature saved for inspection, ${inspection.name}`,
                });
            }


            return res.status(201).send({
                message: "Collaborator signature saved successfully!",
                signatureURL: collaborator.signature.url
            });

        }
    }
    catch (err) {
        return res.status(400).send({
            message: "Failed to save collaborator signature directly!",
            error: err.message,
        });
    }
    finally {
        // Always delete the file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
}