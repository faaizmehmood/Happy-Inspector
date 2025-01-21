import userModel from "../models/userModel.js";
import subUserModel from "../models/subUserModel.js";
import inspectionModel from "../models/inspectionModel.js";
import propertyModel from "../models/propertyModel.js";
import inspectionTemplateModel from "../models/inspectionTemplateModel.js";
import { sendCollaboratorMail, sendEmailsToRecipients, sendInspectorMail } from "../services/signatureMailing.js";
import { QuestionCreation, GetQuestions } from "./questionTemplateController.js";
import { pdfEligibilityOrAllSigned } from "../services/pdfEligibility.js";
import generateAndUploadPDF from "../services/generatePDF.js";
import { deleteImageFromCloudinary } from "../services/imageService.js";
import userActivityModel from "../models/userActivityModel.js";

// Get Inspections (Based on All, Completed, Not Completed, Drafts)
export const getInspections = async (req, res) => {

    const limit = 10;

    try 
    {
        const { _id, role } = req.user;
        const { status, page = 1, search, startdate, enddate } = req.body;
        
        let inspections = [];
        let query;
        let userid = _id;

        if (role === "superAdmin") 
        {
            let { id } = req.query;

            if (!id) {
              return res.status(400).send({
                message: "User not found!",
              });
            }

            userid = id;
        }
        else if (role == "SUBUSER")
        {
            const subUser = await subUserModel.findById(userid);
            // Use $or to match either of the two conditions
            query = {
                $or: [
                    { user: subUser.manager, subUser: { $exists: false } }, // user: subUser.manager, but no subUser field
                    { user: subUser.manager, subUser: userid } // user: subUser.manager and subUser: _id
                ]
            };
        }
        else
        {
            query = { user: userid };
        }

        query.isDeleted = false;

        if (status === "completed") 
        {
            query.isInspectionCompleted = true;
        } 
        else if (status === "notcompleted") 
        {
            query.isInspectionCompleted = false;
            query.isDraft = false;
        } 
        else if (status === "draft") 
        {
            query.isInspectionCompleted = false;
            query.isDraft = true;
        }

        if (search !== "")
        {
            query.name = { $regex: search, $options: "i" };
        }

        if ( startdate && enddate )
        {
            query.updatedAt = { $gte: new Date(startdate), $lt: new Date(enddate) };
        }

        inspections = await inspectionModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('property');

        const totalInspections = await inspectionModel.countDocuments(query);        

        return res.status(201).send({
            message: "Inspections fetched successfully!",
            inspections,
            totalInspections,
            totalPages: Math.ceil(totalInspections / limit),
            currentPage: parseInt(page),
        });
    } catch (err) {
        return res.status(400).send({
            message: "Failed to fetch inspections!",
            error: err.message,
        });
    }
};

// Create Basic Inspection Draft
export const createBasicInspectionDraft = async (req, res) => {

    const { propertyId, name, creationDate, templateId} = req.body;
    const { _id, role } = req.user;

    // console.log("API got propertyId: ", propertyId);

    var generaltemplateid;
    var templatedata;
    var isScratch = false;

    if (templateId && templateId !== "") 
    {
        generaltemplateid = templateId;
        isScratch = false;

        templatedata = await inspectionTemplateModel.findById(templateId);

        if (!templatedata) {
            return res.status(400).send({
                message: "Template not found!",
            });
        }
    }
    else
    {
        if (role === "SUBUSER") {
            const subUser = await subUserModel.findById(_id);
            if (!subUser || subUser.canInspectFromScratch === false) {
                return res.status(403).send({
                    message: "You don't have permission to create an inspection from scratch!",
                });
            }
        }
        
        const DefaultTemplate = await inspectionTemplateModel.findOne({ isDefault: true });
        if (!DefaultTemplate) {
            return res.status(400).send({
                message: "Default template not found!",
            });
        }

        generaltemplateid = DefaultTemplate._id;
        templatedata = DefaultTemplate;
        isScratch = true;
    
    }


    try
    {
        var manager;
        var userid;
        var fullname;

        if (role == "SUBUSER")
        {
            const subUser = await subUserModel.findById(_id);
            manager = subUser.user;
            fullname = subUser.fullname;
            userid = subUser._id;
        }
        else
        {
            const userExists = await userModel.findById(_id);
            userid = userExists._id;
            fullname = userExists.fullname;
        }


        const propertyData = await propertyModel.findById(propertyId);
        if (!propertyData) {
            return res.status(400).send({
                message: "Property not found!",
            });
        }

        const newInspection = await inspectionModel.create({
            template: generaltemplateid,
            property: propertyData._id,
            user: role === "SUBUSER" ? manager : userid,
            name,
            fromScratch: isScratch,
            inspectionDate: creationDate,
            isDraft: true,
            inspectorName: fullname,
            inspectorRole: "Inspector",
            rooms: templatedata.rooms.map((room) => ({
                name: room.name,
                image: [],
                imageRequired: room.imageRequired,
                note: "",
                elements: room.elements.map((element) => ({
                    name: element.name? element.name : "",
                    imageRequired: element.imageRequired,
                    note: element.note? element.note : "",
                    checklist: element.checklist.map((checklistitem) => ({
                        text: checklistitem.text? checklistitem.text : "",
                        options: checklistitem.options? checklistitem.options.map((option) => ({
                            option: option.option,
                            iconId: option.iconId,
                        })) : [],
                        type: checklistitem.type? checklistitem.type : "radio",
                        answer: "",
                        answerRequired: checklistitem.answerRequired? checklistitem.answerRequired : true,
                    })),
                })),
            })),
    // Conditionally include subUser if the role is SUBUSER
    ...(role === "SUBUSER" && { subUser: userid })
    });

        if (role === "SUBUSER") {
            await userActivityModel.create({
                user: manager,
                subUser: userid,
                activity: `Sub User ${fullname} created a new inspection, ${newInspection.name}`,
                subActivity: `You created a new inspection, ${newInspection.name}`,
            })
        }
        else
        {
            await userActivityModel.create({
                user: userid,
                activity: `You created inspection, ${newInspection.name}`,
            })
        }


        return res.status(201).send({
            message: "Inspection created successfully!",
            inspectionid: newInspection._id,
            template: newInspection,
            property: propertyData,
        });
    }
    catch (err) {
        return res.status(400).send({
            message: "Failed to create inspection!",
            error: err.message,
        });
    }
};

//get Complete Inspection
export const getCompleteInspection = async (req, res) => 
{
    const inspectionId = req.params.id;

    try
    {
        const inspection = await inspectionModel.findById(inspectionId);
        if (!inspection) {
            return res.status(400).send({
                message: "Inspection not found!",
            });
        }

        let signaturesData = [];

        if (inspection.collaborators.length > 0) {
            signaturesData = inspection.collaborators.map((collaborator) => ({
                _id: collaborator._id,
                signatoryName: collaborator.name,
                signatoryRole: collaborator.role,
                signatureURL: (collaborator.signature && collaborator.signature.url) ? collaborator.signature.url : "",
            }));
        }

        signaturesData.push({
            _id: "inspector_id",
            signatoryName: inspection.inspectorName,
            signatoryRole: inspection.inspectorRole,
            signatureURL: (inspection.inspectorSignature && inspection.inspectorSignature.url) ? inspection.inspectorSignature.url : "",
        });

        return res.status(201).send({
            message: "Inspection fetched successfully!",
            reportName: inspection.name,
            creationDate: inspection.inspectionDate,
            updateDate: inspection.updatedAt,
            roomsData: inspection.rooms,
            signaturesData,
        });
    }
    catch (err) {
        return res.status(400).send({
            message: "Failed to fetch inspection!",
            error: err.message,
        });
    }
}

export const InspectionAddNewRoom = async (req, res) => 
{
    const { inspectionId, roomName } = req.body;

    try
    {

        const inspection = await inspectionModel.findById(inspectionId);
        if (!inspection) {
            return res.status(400).send({
                message: "Inspection not found!",
            });
        }
        
        inspection.rooms.push({
            name: roomName,
            image: [],
            imageForced: true,
            note: "",
            elements: [],
        });

        await inspection.save();

        return res.status(201).send({
            message: "Room added successfully!",
            newRoom: inspection.rooms[inspection.rooms.length - 1],
        });
    }
    catch (err) {
        return res.status(400).send({
            message: "Failed to add room!",
            error: err.message,
        });
    }
};



export const InspectionAddNewElement = async (req, res) =>
{
    const { inspectionId, roomId, elementName } = req.body;

    const inspection = await inspectionModel.findById(inspectionId);
    if (!inspection) {
        return res.status(400).send({
            message: "Inspection not found!",
        });
    }

    try
    {
        const room = inspection.rooms.id(roomId);
        if (!room) {
            return res.status(400).send({
                message: "Room not found!",
            });
        }

        room.elements.push({
            name: elementName,
            imageForced: true,
            note: "",
            checklist: [],
            image: [
                {
                    url: "",
                    publicId: "",
                },
            ],
        });

        await inspection.save();

        return res.status(201).send({
            message: "Element added successfully!",
            newElement: room.elements[room.elements.length - 1],
        });
    }
    catch (err) {
        return res.status(400).send({
            message: "Failed to add element!",
            error: err.message,
        });
    }
}

export const InspectionAddNewChecklistItem = async (req, res) =>
{
    const { inspectionId, roomId, elementId, questions  } = req.body;

    const inspection = await inspectionModel.findById(inspectionId);
    if (!inspection) {
        return res.status(400).send({
            message: "Inspection not found!",
        });
    }

    try
    {
        const { _id, role } = req.user;
        if (role === "SUBUSER")
        {
            const subuser = await subUserModel.findById(_id);
            if(subuser.canCreateInspectionQuestions === false)
            {
                return res.status(400).send({
                    message: "You don't have permission to add questions!",
                });
            }
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

        for (const question of questions) {
            element.checklist.push({
                text: question.text,
                options: question.options.map((option) => ({
                    option: option.option,
                    iconId: option.iconId,
                })),
                type: question.type,
                answer: "",
                answerRequired: question.answerRequired,
            });
        
            if (question.shouldSave) {
                await QuestionCreation(_id, role, question.text, question.type, question.options, question.answerRequired);
            }
        }
        

        await inspection.save();

        return res.status(201).send({
            message: "Checklist item added successfully!",
            newChecklistItems: element.checklist.slice(-questions.length),
        });
    }
    catch (err) {
        return res.status(400).send({
            message: "Failed to add checklist item!",
            error: err.message,
        });
    }
}

export const InspectionDeleteRoom = async (req, res) => {
    const { inspectionId, roomIdArray } = req.body;

    try {
        // Find the inspection document
        const inspection = await inspectionModel.findById(inspectionId);

        if (!inspection) {
            return res.status(404).send({
                message: "Inspection not found!",
            });
        }
        //delete Rooms Images

        // Delete the rooms
        roomIdArray.forEach((roomId) => {
            inspection.rooms.id(roomId).deleteOne({ _id: roomId });
        });

        // Save the inspection document
        await inspection.save();

        return res.status(200).send({
            message: "Room deleted successfully!",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Failed to delete room!",
            error: err.message,
        });
    }
};


export const InspectionDeleteElement = async (req, res) =>
{
    const { inspectionId, roomId, elementIdArray } = req.body;

    const inspection = await inspectionModel.findById(inspectionId);
    if (!inspection) {
        return res.status(400).send({
            message: "Inspection not found!",
        });
    }

    try
    {
        const room = inspection.rooms.id(roomId);
        if (!room) {
            return res.status(400).send({
                message: "Room not found!",
            });
        }

        //delete Element Images

        elementIdArray.forEach((elementId) => {
            room.elements.id(elementId).deleteOne({ _id: elementId });
        });

        await inspection.save();

        return res.status(201).send({
            message: "Element deleted successfully!",
        });
    }
    catch (err) {
        return res.status(400).send({
            message: "Failed to delete element!",
            error: err.message,
        });
    }
}

export const InspectionDeleteChecklistItem = async (req, res) =>
{
    const { inspectionId, roomId, elementId, checklistIdArray } = req.body;

    const inspection = await inspectionModel.findById(inspectionId);
    if (!inspection) {
        return res.status(400).send({
            message: "Inspection not found!",
        });
    }

    try
    {
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

        checklistIdArray.forEach((checklistId) => {
            element.checklist.id(checklistId).deleteOne({ _id: checklistId });
        });

        await inspection.save();

        return res.status(201).send({
            message: "Checklist item deleted successfully!",
        });
    }
    catch (err) {
        return res.status(400).send({
            message: "Failed to delete checklist item!",
            error: err.message,
        });
    }
}

//Update Room Image Caption
export const InspectionUpdateRoomImageCaption = async (req, res) =>
{
    const { inspectionId, roomId, imageId, caption } = req.body;

    try
    {
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

        image.caption = caption;

        await inspection.save();

        return res.status(201).send({
            message: "Room image caption updated successfully!",
        });

    }
    catch (err) {
        return res.status(400).send({
            message: "Failed to update room image caption!",
            error: err.message,
        });
    }
}

export const InspectionUpdateRoom = async (req, res) =>
{
     const { inspectionId, roomData } = req.body;
    
     const inspection = await inspectionModel.findById(inspectionId);
     if (!inspection) {
          return res.status(400).send({
                message: "Inspection not found!",
          });
    }

    try
    {
        const room = inspection.rooms.id(roomData._id);
        if (!room) {
            return res.status(400).send({
                message: "Room not found!",
            });
        }

        room.name = roomData.name;
        room.note = roomData.note;
        room.isCompleted = true;

        if (roomData.elements.length > 0) 
        {
            roomData.elements.forEach((newElement) => {
                const existingElement = room.elements.id(newElement._id);

                if (existingElement) {
                    // Update only the fields provided in roomData.elements without affecting image or imageRequired
                    existingElement.name = newElement.name || existingElement.name;
                    existingElement.note = newElement.note || existingElement.note;
                    
                    existingElement.checklist = newElement.checklist.map((checklistitem) => (
                    {
                        text: checklistitem.text,
                        options: checklistitem.options ? checklistitem.options.map((option) => ({
                            option: option.option,
                            iconId: option.iconId,
                        })) : [],
                        type: checklistitem.type || "radio",
                        answer: checklistitem.answer || "",
                        answerRequired: checklistitem.answerRequired,
                    }
                ));
            }});
                
        }

        await inspection.save();

        return res.status(201).send({
            message: "Room updated successfully!",
        });
    }
    catch (err) {
        return res.status(400).send({
            message: "Failed to update room!",
            error: err.message,
        });
    }
    
}


export const getSpecificInspection = async (req, res) => {
    try {
        const inspectionId = req.params.id;

        // Find the inspection, populate the property, and select the required fields
        const inspection = await inspectionModel.findById(inspectionId)
            .populate('property') // Populate property data, adjust fields as needed
            .select('rooms._id rooms.name rooms.elements rooms.isCompleted name inspectorName inspectorRole inspectionDate collaborators inspectionDate updatedAt');

        // Check if inspection exists
        if (!inspection) {
            return res.status(404).send({
                message: "Inspection not found!",
            });
        }

        // Map the rooms to return only their _id and name
        const rooms = inspection.rooms.map(room => ({
            _id: room._id,
            name: room.name,
            isCompleted: room.isCompleted ? room.isCompleted : false,
            elementCount: room.elements.length,
        }));

        // Map the collaborators to return only their _id, name, role, and email
        const collaborators = inspection.collaborators.map(collaborator => ({
            _id: collaborator._id,
            collaboratorName: collaborator.name,
            collaboratorRole: collaborator.role,
            collaboratorEmail: collaborator.email,
            shouldSendSignatureMail: collaborator.shouldSendSignatureMail,
            signatureNotRequired: collaborator.signatureNotRequired
        }));

        // Extract required fields
        const { inspectorName, inspectorRole, inspectionDate, property, name, createdAt, updatedAt } = inspection;

        return res.status(200).send({
            message: "Inspection fetched successfully!",
            rooms,
            name,
            inspectorName,
            inspectorRole,
            inspectionDate,
            createdAt,
            updatedAt,
            property,
            collaborators,
        });
    } catch (err) {
        return res.status(500).send({
            message: "Failed to fetch inspection!",
            error: err.message,
        });
    }
}


export const getInspectionRoomData = async (req, res) => {
    try {
        const { inspectionId, roomId } = req.body;
        const { _id, role } = req.user;

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

        const questions = await GetQuestions(_id, role);

        return res.status(200).send({
            message: "Room data fetched successfully!",
            room,
            questions,
        });
    } catch (err) {
        return res.status(500).send({
            message: "Failed to fetch room data!",
            error: err.message,
        });
    }
}


export const saveInspectionDraft = async (req, res) =>
{
    const { inspectionId } = req.body;

    const inspection = await inspectionModel.findById(inspectionId);
    if (!inspection) {
        return res.status(400).send({
            message: "Inspection not found!",
        });
    }

    try
    {
        inspection.isDraft = false;

        await inspection.save();

        return res.status(201).send({
            message: "Inspection saved successfully!",
        });
    }
    catch (err) {
        return res.status(400).send({
            message: "Failed to save inspection!",
            error: err.message,
        });
    }
}

export const reArrangeRooms = async (req, res) => {
    const { inspectionId, roomIds } = req.body;

    if (!inspectionId || !Array.isArray(roomIds)) {
        return res.status(400).send({
            message: "Invalid request data!",
        });
    }

    try {
        const inspection = await inspectionModel.findById(inspectionId);
        if (!inspection) {
            return res.status(404).send({
                message: "Inspection not found!",
            });
        }

        // Reorder rooms based on roomIds
        const newRooms = [];
        roomIds.forEach((roomId) => {
            const room = inspection.rooms.id(roomId);
            if (room) {
                newRooms.push(room);
            }
        });

        // Replace the existing rooms with the newly ordered rooms
        inspection.rooms = newRooms;

        await inspection.save();

        return res.status(200).send({
            message: "Rooms rearranged successfully!",
        });
    } catch (err) {
        return res.status(500).send({
            message: "Failed to rearrange rooms!",
            error: err.message,
        });
    }
};


export const reArrangeElements = async (req, res) => {
    const { inspectionId, roomId, elementIds } = req.body;

    if (!inspectionId || !roomId || !Array.isArray(elementIds)) {
        return res.status(400).send({
            message: "Invalid request data!",
        });
    }

    try {
        const inspection = await inspectionModel.findById(inspectionId);
        if (!inspection) {
            return res.status(404).send({
                message: "Inspection not found!",
            });
        }

        const room = inspection.rooms.id(roomId);
        if (!room) {
            return res.status(404).send({
                message: "Room not found!",
            });
        }

        // Reorder elements based on elementIds
        const newElements = [];
        elementIds.forEach((elementId) => {
            const element = room.elements.id(elementId);
            if (element) {
                newElements.push(element);
            }
        });

        // Replace the existing elements with the newly ordered elements
        room.elements = newElements;

        await inspection.save();

        return res.status(200).send({
            message: "Elements rearranged successfully!",
        });
    } catch (err) {
        return res.status(500).send({
            message: "Failed to rearrange elements!",
            error: err.message,
        });
    }
};

export const inspectionAddCollaborator = async (req, res) => {
    const { inspectionId, name, email, role, shouldSendSignatureMail, signatureNotRequired } = req.body;

    const inspection = await inspectionModel.findById(inspectionId);
    if (!inspection) {
        return res.status(400).send({
            message: "Inspection not found!",
        });
    }

    //check if a collaborator with the same email already exists
    const collaboratorExists = inspection.collaborators.find(collaborator => collaborator.email === email);
    if (collaboratorExists) {
        return res.status(400).send({
            message: "A Collaborator with the same email already exists!",
        });
    }

    try {
        inspection.collaborators.push({
            name,
            email,
            role,
            shouldSendSignatureMail,
            signatureNotRequired
        });

        await inspection.save();

        if(inspection.subUser)
        {
            const subUser = await subUserModel.findById(inspection.subUser);
            if(!subUser)
            {
                return res.status(400).send({
                    message: "Sub User not found!",
                });
            }

            await userActivityModel.create({
                user: inspection.user,
                subUser: inspection.subUser,
                activity: `Sub User ${subUser.fullname} added a collaborator ${name} to inspection ${inspection.name}`,
                subActivity: `You added a collaborator ${name} to inspection ${inspection.name}`,
            });
        }
        else
        {
            await userActivityModel.create({
                user: inspection.user,
                activity: `You added a collaborator ${name} to inspection ${inspection.name}`,
            });
        }

        return res.status(201).send({
            message: "Collaborator added successfully!",
            collaborator: inspection.collaborators[inspection.collaborators.length - 1],
        });
    } catch (err) {
        return res.status(500).send({
            message: "Failed to add collaborator!",
            error: err.message,
        });
    }
}

export const inspectionUpdateCollaborator = async (req, res) => {
    const { inspectionId, collaboratorId, name, email, role, shouldSendSignatureMail, signatureNotRequired } = req.body;

    const inspection = await inspectionModel.findById(inspectionId);
    if (!inspection) {
        return res.status(400).send({
            message: "Inspection not found!",
        });
    }

    try {
        const collaborator = inspection.collaborators.id(collaboratorId);
        if (!collaborator) {
            return res.status(400).send({
                message: "Collaborator not found!",
            });
        }

        collaborator.name = name;
        collaborator.email = email;
        collaborator.role = role;
        collaborator.shouldSendSignatureMail = shouldSendSignatureMail;
        collaborator.signatureNotRequired = signatureNotRequired;

        await inspection.save();

        return res.status(200).send({
            message: "Collaborator updated successfully!",
        });
    } catch (err) {
        return res.status(500).send({
            message: "Failed to update collaborator!",
            error: err.message,
        });
    }
}

export const inspectionDeleteCollaborator = async (req, res) => {
    const { inspectionId, collaboratorId } = req.body;

    const inspection = await inspectionModel.findById(inspectionId);
    if (!inspection) {
        return res.status(400).send({
            message: "Inspection not found!",
        });
    }

    try 
    {
        inspection.collaborators.id(collaboratorId).deleteOne({ _id: collaboratorId });

        await inspection.save();

        return res.status(200).send({
            message: "Collaborator deleted successfully!",
        });
    } catch (err) {
        return res.status(500).send({
            message: "Failed to delete collaborator!",
            error: err.message,
        });
    }
}

export const inspectionCompleteDraft = async (req, res) => 
{
    const { inspectionId, reportName, propertyId, inspectionDate, inspectorName, inspectorRole, emails } = req.body;

    try
    {
        const inspection = await inspectionModel.findById(inspectionId);
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

        inspection.name = reportName;
        inspection.property = propertyData._id;
        inspection.inspectionDate = inspectionDate;
        inspection.inspectorName = inspectorName;
        inspection.inspectorRole = inspectorRole;
        inspection.isDraft = false;

        await inspection.save();

        if (emails.length > 0) {
            emails.forEach(async (email) => {
                collaboratorId = inspection.collaborators.find(collaborator => collaborator.email === email)._id;

                await sendCollaboratorMail(email, collaboratorId, inspectorName, inspection._id);
            });
        }

        return res.status(201).send({
            message: "Draft inspection completed successfully!",
        });

    }
    catch (err) {
        return res.status(400).send({
            message: "Failed to complete inspection!",
            error: err.message,
        });
    }
}

export const generateInspectionPDF = async (req, res) => {

    const { inspectionId } = req.body;

    try
    {
        const {_id, role} = req.user;
        const inspection = await inspectionModel.findById(inspectionId).populate('property');
        if (!inspection) {
            return res.status(400).send({
                message: "Inspection not found!",
            });
        }

        const userExists = await userModel.findById(inspection.user);
        if (!userExists) {
            return res.status(400).send({
                message: "User not found!",
            });
        }

        if (!inspection.isInspectionCompleted) {
            return res.status(400).send({
                message: "Inspection is not completed!",
            });
        }
        else
        {
            if (!inspection.pdfReportGenerated) {

                var emailRecipients = [];
                emailRecipients.push(userExists.email);

                if (role === "SUBUSER") {
                    const subUser = await subUserModel.findById(_id);
                    emailRecipients.push(subUser.email);
                }

                inspection.collaborators.forEach((collaborator) => {
                    emailRecipients.push(collaborator.email);
                });

                const { pdfBuffer, pdfUrl } = await generateAndUploadPDF(
                inspectionId,
                inspection.name,
                inspection.property.address,
                inspection.inspectionDate,
                inspection.rooms,
                inspection.inspectorName,
                inspection.inspectorRole,
                inspection.inspectorSignature,
                inspection.collaborators,
                `${inspection.user.toString()}/${inspection.property._id.toString()}`

              );

              if(inspection.subUser)
              {
                const subUser = await subUserModel.findById(inspection.subUser);
                if(!subUser)
                {
                    return res.status(400).send({
                        message: "Sub User not found!",
                    });
                }
    
                await userActivityModel.create({
                    user: inspection.user,
                    subUser: inspection.subUser,
                    activity: `Sub User ${subUser.fullname} has generated the PDF report for inspection, ${inspection.name}`,
                    subActivity: `You have generated the PDF report for inspection, ${inspection.name}`,
                });
              }
              else
              {
                await userActivityModel.create({
                    user: inspection.user,
                    activity: `You have generated the PDF report for inspection, ${inspection.name}`,
                });
              }

              //Send the PDF buffer and Cloudinary URL back to the client
              res.set({
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="inspection-${inspection.name}.pdf"`,
              });

              res.status(200).send(pdfBuffer);

            //   await sendEmailsToRecipients(emailRecipients, pdfUrl, inspection.name);

            }
            else
            {
                //Get latest PDF link
                var pdfLink = inspection.pdfReportUrl[pdfReportUrl.length - 1].url;

                return res.status(201).send({
                    message: "PDF already generated!",
                    pdfLink: pdfLink
                });
            }
        }
    }
    catch (err) {
        return res.status(500).send({
            message: "Failed to generate PDF!",
            error: err.message,
        });
    }
};

export const reEditInspection = async (req, res) => {

    const { inspectionId } = req.body;

    try
    {
        const inspection = await inspectionModel.findById(inspectionId);
        if (!inspection) {
            return res.status(400).send({
                message: "Inspection not found!",
            });
        }


        inspection.isInspectionCompleted = false;
        inspection.pdfReportGenerated = false;
        inspection.inspectorSignature = "";
        for (const collaborator of inspection.collaborators) {
            

            if (collaborator.signature && collaborator.signature.publicId && collaborator.signature.publicId !== "") {
                await deleteImageFromCloudinary(collaborator.signature.publicId);
                collaborator.signature.url = "";
                collaborator.signature.publicId = "";
            }
            collaborator.shouldSendSignatureMail = false;
            collaborator.signatureNotRequired = true;
        };

        inspection.isDraft = true;

        await inspection.save();

        return res.status(201).send({
            message: "Inspection re-edited successfully!",
        });
    }
    catch (err) {
        return res.status(400).send({
            message: "Failed to re-edit inspection!",
            error: err.message,
        });
    }
};

export const getInspectionsByPropertyId = async (req, res) => {

    const { propertyId, page = 1, limit = 10 } = req.query;

    try
    {
        if (!propertyId) {
            return res.status(400).send({
                message: "Property ID is required!",
            });
        }

        if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
            return res.status(400).send({
                message: "Invalid page or limit!",
            });
            
        }

        const inspections = await inspectionModel
        .find({ property: propertyId })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

        var relatedInspections = inspections.map(inspection => {
            let inspectionStatus = "Test Value";
    
            if (inspection.isInspectionCompleted) {
              inspectionStatus = "Completed";
            }
            else if (inspection.isDraft) {
              inspectionStatus = "Drafted";
            }
            else
            {
              inspectionStatus = "In Progress";
            }
    
            return {
              _id: inspection._id,
              lastUpdated: inspection.updatedAt,
              reportName: inspection.name,
              inspectionStatus: inspectionStatus,
            };
        });

        const totalInspections = await inspectionModel.countDocuments({ property: propertyId });

        return res.status(200).send({
            message: "Inspections fetched successfully!",
            inspections: relatedInspections,
            totalInspections,
            totalPages: Math.ceil(totalInspections / limit),
            currentPage: parseInt(page),

        })
    }
    catch (err) {
        return res.status(400).send({
            message: "Failed to fetch inspections!",
            error: err.message,
        });
    }
}

export const getInspectionReportNameAndCreationDate = async (req, res) =>
{
    const { inspectionId } = req.body;

    try
    {
        const inspection = await inspectionModel.findById(inspectionId);
        if (!inspection) {
            return res.status(400).send({
                message: "Inspection not found!",
            });
        }

        return res.status(200).send({
            message: "Inspection report name and creation date fetched successfully!",
            reportName: inspection.name,
            inspectionDate: inspection.inspectionDate,
        });
    }
    catch (err) {
        return res.status(500).send({
            message: "Failed to fetch inspection report name and creation date!",
            error: err.message,
        });
    }
}

// Get All Completed Inspection of a User with Report Generated
export const getReportGeneratedInspections = async (req, res) => {

    const limit = 10;

    try 
    {
        const { _id, role } = req.user;
        const { page = 1, search, template, startdate, enddate } = req.body;
        
        let inspections = [];
        let query;

        if (role === "SUBUSER")
        {
            query = { subUser: _id, isInspectionCompleted: true, isDraft: false, pdfReportGenerated: true, isDeleted: false };
        }
        else
        {
            query = { user: _id, isInspectionCompleted: true, isDraft: false, pdfReportGenerated: true, isDeleted: false };
        }

        if (search !== "")
        {
            query.name = { $regex: search, $options: "i" };
        }

        if ( startdate && enddate )
        {
            query.updatedAt = { $gte: new Date(startdate), $lt: new Date(enddate) };
        }

        if (template !== "all")
        {
            query.template = template;
        }

        inspections = await inspectionModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('property')
        .populate('template')
        .select('name updatedAt');

        //each inspection should only have updatedAt, name, template name
        inspections = inspections.map((inspection) => ({
            _id: inspection._id,
            name: inspection.name,
            updatedAt: inspection.updatedAt,
            templateName: inspection.template.name,
            reportLink: inspection.pdfReportUrl[pdfReportUrl.length - 1].url,
        }));

        const totalInspections = await inspectionModel.countDocuments(query);        

        return res.status(201).send({
            message: "Inspections fetched successfully!",
            inspections,
            totalInspections,
            totalPages: Math.ceil(totalInspections / limit),
            currentPage: parseInt(page),
        });
    } catch (err) {
        return res.status(400).send({
            message: "Failed to fetch inspections!",
            error: err.message,
        });
    }
};

export const TestAPI = async (req, res) => {

    try
    {
        const { value } = req.body;

        const inspection = await inspectionModel.findById(value);

        const result = await pdfEligibilityOrAllSigned(inspection);

        res.status(200).send({
            message: "Tested Successfully!",
            result
        });

    }
    catch (err) {
        return res.status(400).send({
            message: "Failed to Test!",
            error: err.message,
        });
    }
};
