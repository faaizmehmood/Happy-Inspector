import inspectionTemplateModel from "../models/inspectionTemplateModel.js";
import subUserModel from "../models/subUserModel.js";
import userModel from "../models/userModel.js";
import userActivityModel from "../models/userActivityModel.js";
import { GetQuestions, QuestionCreation } from "./questionTemplateController.js";
import { Types } from 'mongoose';

// Create Inspection Template (NEW) (Custom)
export const createInspectionTemplate = async (req, res) => {
  const { name, rooms} = req.body;
  const { _id } = req.user;

  const userExists = await userModel.findById(_id);
  if (!userExists) {
    return res.status(400).send({
      message: "User not found!",
    });
  }

  try {
    const newInspectionTemplate = await inspectionTemplateModel.create({
      user: _id,
      isDefault: false,
      isDraft: false,
      name,
      rooms: rooms.map((room) => ({
        name: room.name,
        imageRequired: room.imageRequired,
        elements: room.elements.map((element) => ({
          name: element.name,
          imageRequired: element.imageRequired,
          checklist: element.checklist.map((checklist) => ({
            text: checklist.text,
            type: checklist.type,
            options: checklist.options.map((option) => ({
              option: option.option,
              iconId: option.iconId,
            })),
            answerRequired: checklist.answerRequired,
          })),
        })),
      })),
    });

    return res.status(201).send({
      message: "Inspection template created successfully!",
      inspectionTemplate: newInspectionTemplate,
    });
  } catch (err) {
    return res.status(400).send({
      message: "Failed to create inspection template!",
      error: err.message,
    });
  }
};

// Create Inspection Template (Draft)
export const createInspectionTemplateDraft = async (req, res) => {
  const { name, rooms} = req.body;
  const { _id } = req.user;

  const userExists = await userModel.findById(_id);
  if (!userExists) {
    return res.status(400).send({
      message: "User not found!",
    });
  }

  try {
    const newInspectionTemplate = await inspectionTemplateModel.create({
      user: _id,
      isDefault: false,
      isDraft: true,
      name,
      rooms: rooms.map((room) => ({
        name: room.name,
        imageRequired: room.imageRequired,
        elements: room.elements.map((element) => ({
          name: element.name,
          imageRequired: element.imageRequired,
          checklist: element.checklist.map((checklist) => ({
            text: checklist.text,
            type: checklist.type,
            options: checklist.options.map((option) => ({
              option: option.option,
              iconId: option.iconId,
            })),
            answerRequired: checklist.answerRequired,
          })),
        })),
      })),
    });

    return res.status(201).send({
      message: "Inspection template draft created successfully!",
      inspectionTemplate: newInspectionTemplate,
    });
  } catch (err) {
    return res.status(400).send({
      message: "Failed to create inspection template draft!",
      error: err.message,
    });
  }
};

// Create Inspection Template (Default)
export const createDefaultInspectionTemplate = async (req, res) => {
  const { name, rooms} = req.body;

  try {
    const newInspectionTemplate = await inspectionTemplateModel.create({
      isDefault: true,
      name,
      rooms: rooms.map((room) => ({
        name: room.name,
        image: room.image,
        imageRequired: room.imageRequired,
        elements: room.elements.map((element) => ({
          name: element.name,
          image: element.image,
          imageRequired: element.imageRequired,
          checklist: element.checklist.map((checklist) => ({
            text: checklist.text,
            type: checklist.type,
            options: checklist.options.map((option) => ({
              option: option.option,
              iconId: option.iconId,
            })),
            answerRequired: checklist.answerRequired,
          })),
        })),
      })),
    });

    return res.status(201).send({
      message: "Inspection template created successfully!",
      inspectionTemplate: newInspectionTemplate,
    });
  } catch (err) {
    return res.status(400).send({
      message: "Failed to create inspection template!",
      error: err.message,
    });
  }
};

export const getTemplates = async (req, res) => {

  const { _id, role } = req.user;
  console.log(_id, role);

  try {
    let userid = "";
    let usertemplates = [];

    if (role === "SUBUSER") {
      const subUser = await subUserModel.findById(_id);
      userid = subUser.manager;

      usertemplates = await inspectionTemplateModel.find({ user: userid, isDraft: false, isDeleted: false });
    } 
    else 
    {
      userid = _id;

      if (role === "FREETIER") {
        // Templates with ≤ 5 rooms, each room with ≤ 5 elements
        userid = new Types.ObjectId(userid);
        usertemplates = await inspectionTemplateModel.aggregate([
          {
            $match: {
              user: userid,
              isDeleted: false,
              isDraft: false,
            },
          },
          {
            $addFields: {
              validRooms: {
                $filter: {
                  input: "$rooms",
                  as: "room",
                  cond: { $lte: [{ $size: "$$room.elements" }, 5] }, // Each room must have ≤ 5 elements
                },
              },
            },
          },
          {
            $match: {
              $expr: {
                $and: [
                  { $lte: [{ $size: "$rooms" }, 5] }, // Template must have ≤ 5 rooms
                  { $eq: [{ $size: "$validRooms" }, { $size: "$rooms" }] }, // All rooms must meet the element condition
                ],
              },
            },
          },
          {
            $project: {
              validRooms: 0, // Exclude intermediate fields from the result
            },
          },
        ]);
      } else if (role === "STANDARDTIER") {
        // Templates with ≤ 10 rooms, each room with ≤ 10 elements

        userid = new Types.ObjectId(userid);

        usertemplates = await inspectionTemplateModel.aggregate([
          {
            $match: {
              user: userid,
              isDeleted: false,
              isDraft: false,
            },
          },
          {
            $addFields: {
              validRooms: {
                $filter: {
                  input: "$rooms",
                  as: "room",
                  cond: { $lte: [{ $size: "$$room.elements" }, 10] }, // Each room must have ≤ 10 elements
                },
              },
            },
          },
          {
            $match: {
              $expr: {
                $and: [
                  { $lte: [{ $size: "$rooms" }, 10] }, // Template must have ≤ 10 rooms
                  { $eq: [{ $size: "$validRooms" }, { $size: "$rooms" }] }, // All rooms must meet the element condition
                ],
              },
            },
          },
          {
            $project: {
              validRooms: 0, // Exclude intermediate fields from the result
            },
          },
        ]);
      }
      else if (role === "TOPTIER") 
      {
        usertemplates = await inspectionTemplateModel.find({ user: userid, isDraft: false, isDeleted: false });
      }
    }
    const defaulttemplates = await inspectionTemplateModel.find({ isDefault: true });

    return res.status(200).send({
      message: "Inspection templates fetched successfully!",
      templates: defaulttemplates.concat(usertemplates),
    });
  } catch (err) {
    return res.status(400).send({
      message: "Failed to fetch inspection templates!",
      error: err.message,
    });
  }
};

// Get All Templates
export const getAllTemplates = async (req, res) => {

  const limit = 10;

  try 
  {
    const { _id, role } = req.user;
    const { page = 1, search, status, startdate, enddate } = req.body;
    
    let templates = [];
    let defaultTemplates = [];
    let remainingLimit = limit;
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

    let query = { user: userid, isDeleted: false };

    if (status == "drafted") {
      query.isDraft = true;
    }
    else if (status == "completed") {
      query.isDraft = false;
    }

    if (search !== "") {
      query.name = { $regex: search, $options: "i" };
    }

    if (startdate && enddate) {
      query.updatedAt = { $gte: startdate, $lt: enddate };
    }

    if (page == 1 && (status == "default" || status == "all")) 
    {
      defaultTemplates = await inspectionTemplateModel
      .find({
        isDefault: true,
        isDeleted: false,
        ...(search !== "" && { name: { $regex: search, $options: "i" } }),
      })
      .select("name updatedAt isDraft isDefault")
      .sort({ updatedAt: -1 });

      remainingLimit = limit - defaultTemplates.length;
    }


    if (status !== "default")
    {
      templates = await inspectionTemplateModel
      .find(query)
      .skip((page - 1) * remainingLimit)
      .limit(parseInt(remainingLimit))
      .select('name updatedAt isDraft');
    }

    const userTemplates = status == "default" ? 0 : await inspectionTemplateModel.countDocuments(query);

    const totalTemplates = defaultTemplates.length + userTemplates;
    const combinedTemplates = defaultTemplates.concat(templates);

    return res.status(200).send({
      message: "Inspection templates fetched successfully!",
      templates: combinedTemplates,
      totalTemplates,
      totalPages: Math.ceil(totalTemplates / limit),
      currentPage: parseInt(page),
    });

  }
  catch (error) {
    console.error("Error fetching templates:", error);
    return res.status(400).send({
      message: "Failed to fetch templates!",
    });
  }
};

//clone inspection template
export const cloneInspectionTemplate = async (req, res) => {
  const { _id } = req.user;
  const { templateId } = req.body;

  const userExists = await userModel.findById(_id);
  if (!userExists) {
    return res.status(400).send({
      message: "User not found!",
    });
  }

  try {
    const template = await inspectionTemplateModel.findById(templateId);
    if (!template) {
      return res.status(400).send({
        message: "Template not found!",
      });
    }

    const newTemplate = await inspectionTemplateModel.create({
      user: _id,
      isDefault: false,
      isDraft: template.isDraft,
      name: `${template.name} (Clone)`,
      rooms: template.rooms.map((room) => ({
        name: room.name,
        imageRequired: room.imageRequired,
        elements: room.elements.map((element) => ({
          name: element.name,
          imageRequired: element.imageRequired,
          checklist: element.checklist.map((checklist) => ({
            text: checklist.text,
            type: checklist.type,
            options: checklist.options.map((option) => ({
              option: option.option,
              iconId: option.iconId,
            })),
            answerRequired: checklist.answerRequired,
          })),
        })),
      })),
    });

    const formattedTemplate = {
      _id: newTemplate._id,
      name: newTemplate.name,
      updatedAt: newTemplate.updatedAt,
      isDraft: newTemplate.isDraft,
    }

    await userActivityModel.create({
      user: _id,
      activity: `You cloned inspection template named ${template.name}`,
    });

    return res.status(201).send({
      message: "Template cloned successfully!",
      template: formattedTemplate,
    });
  }
  catch (error) {
    console.error("Error cloning template:", error);
    return res.status(400).send({
      message: "Failed to clone template!",
    });
  }
};


// Create Basic Inspection Template Draft
export const createBasicInspectionTemplateDraft = async (req, res) => {
  const { _id } = req.user;

  const userExists = await userModel.findById(_id);
  if (!userExists) {
    return res.status(400).send({
      message: "User not found!",
    });
  }

  try {

    const { templateName } = req.body;

    const newInspectionTemplate = await inspectionTemplateModel.create({
      user: _id,
      isDefault: false,
      isDraft: true,
      name: templateName,
      rooms: [],
    });

    await userActivityModel.create({
      user: _id,
      activity: `You created basic inspection template named ${templateName}`,
    });

    return res.status(201).send({
      message: "Basic inspection template draft created successfully!",
      templateId: newInspectionTemplate._id,
    });
  } catch (err) {
    return res.status(400).send({
      message: "Failed to create basic inspection template draft!",
      error: err.message,
    });
  }
}


// Add Template Room
export const TemplateAddRoom = async (req, res) => {
  const { templateId, roomName } = req.body;

  try {
    const template = await inspectionTemplateModel.findById(templateId);
    if (!template) {
      return res.status(400).send({
        message: "Template not found!",
      });
    }

    template.rooms.push({
      name: roomName,
      elements: [],
      imageRequired: false
    });

    await template.save();

    var newRoom = template.rooms[template.rooms.length - 1];
    newRoom = newRoom.toObject();
    newRoom.elementCount = 0;

    return res.status(200).send({
      message: "Room added successfully!",
      newRoom: newRoom,
      
    });
  } catch (err) {
    return res.status(400).send({
      message: "Failed to add room!",
      error: err.message,
    });
  }
};

// Add Template Element
export const TemplateAddElement = async (req, res) => {

  const { templateId, roomId, elementName } = req.body;

  try {
    const template = await inspectionTemplateModel.findById(templateId);
    if (!template) {
      return res.status(400).send({
        message: "Template not found!",
      });
    }

    const room = template.rooms.id(roomId);
    if (!room) {
      return res.status(400).send({
        message: "Room not found!",
      });
    }

    room.elements.push({
      name: elementName,
      checklist: [],
      imageRequired: false
    });

    await template.save();

    return res.status(200).send({
      message: "Element added successfully!",
      newElement: room.elements[room.elements.length - 1]
    });
  } catch (err) {
    return res.status(400).send({
      message: "Failed to add element!",
      error: err.message,
    });
  }
};

//Template Add Checklist Item
export const TemplateAddChecklistItem = async (req, res) => {

  try{

    const { templateId, roomId, elementId, questions  } = req.body;
    const { _id, role } = req.user;

    const template = await inspectionTemplateModel.findById(templateId);
    if (!template) {
      return res.status(400).send({
        message: "Template not found!",
      });
    }

    const room = template.rooms.id(roomId);
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
        type: question.type,
        options: question.options? question.options.map((option) => ({
          option: option.option,
          iconId: option.iconId,
        })) : [],
        answerRequired: question.answerRequired,
      });

      if(question.shouldSave){
        await QuestionCreation(_id, role, question.text, question.type, question.options, question.answerRequired);
      }
    }

    await template.save();

    return res.status(200).send({
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
};

// Delete Template Room
export const TemplateDeleteRoom = async (req, res) => {
  const { templateId, roomIdArray } = req.body;

  try {
    const template = await inspectionTemplateModel.findById(templateId);
    if (!template) {
      return res.status(400).send({
        message: "Template not found!",
      });
    }

    roomIdArray.forEach((roomId) => {
      template.rooms.id(roomId).deleteOne({ _id: roomId });
    });

    await template.save();

    return res.status(200).send({
      message: "Room deleted successfully!",
    });
  } catch (err) {
    return res.status(400).send({
      message: "Failed to delete room!",
      error: err.message,
    });
  }
};

// Delete Template Element
export const TemplateDeleteElement = async (req, res) => {
  const { templateId, roomId, elementIdArray } = req.body;

  try {
    const template = await inspectionTemplateModel.findById(templateId);
    if (!template) {
      return res.status(400).send({
        message: "Template not found!",
      });
    }

    const room = template.rooms.id(roomId);
    if (!room) {
      return res.status(400).send({
        message: "Room not found!",
      });
    }

    elementIdArray.forEach((elementId) => {
      room.elements.id(elementId).deleteOne({ _id: elementId });
    });

    await template.save();

    return res.status(200).send({
      message: "Element deleted successfully!",
    });
  } catch (err) {
    return res.status(400).send({
      message: "Failed to delete element!",
      error: err.message,
    });
  }
};

// Delete Template Checklist Item
export const TemplateDeleteChecklistItem = async (req, res) => {
  try
  {
    const { templateId, roomId, elementId, checklistItemIdArray } = req.body;

    const template = await inspectionTemplateModel.findById(templateId);
    if (!template) {
      return res.status(400).send({
        message: "Template not found!",
      });
    }

    const room = template.rooms.id(roomId);
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

    checklistItemIdArray.forEach((checklistItemId) => {
      element.checklist.id(checklistItemId).deleteOne({ _id: checklistItemId });
    }
    );

    await template.save();

    return res.status(200).send({
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

export const getSpecificTemplate = async (req, res) => {
  try {
    
    const templateId = req.params.id;

    const template = await inspectionTemplateModel.findById(templateId).select('rooms._id rooms.name rooms.elements');
    if (!template) {
      return res.status(400).send({
        message: "Template not found!",
      });
    }

    const rooms = template.rooms.map((room) => ({
      _id: room._id,
      name: room.name,
      elementCount: room.elements.length,
    }));

    return res.status(200).send({
      message: "Template fetched successfully!",
      rooms,
    });
  } catch (err) {
    return res.status(400).send({
      message: "Failed to fetch template!",
      error: err.message,
    });
  }
}

export const getTemplateRoomData = async (req, res) => {
  try {
    const { templateId, roomId } = req.body;
    const {_id, role} = req.user;

    const template = await inspectionTemplateModel.findById(templateId);
    if (!template) {
      return res.status(400).send({
        message: "Template not found!",
      });
    }

    const room = template.rooms.id(roomId);
    if (!room) {
      return res.status(400).send({
        message: "Room not found!",
      });
    }

    const questions =  await GetQuestions(_id, role);

    return res.status(200).send({
      message: "Room data fetched successfully!",
      room,
      questions,
    });
  }
  catch (err) {
    return res.status(400).send({
      message: "Failed to fetch room data!",
      error: err.message,
    });
  }
}

export const TemplateUpdateRoom = async (req, res) => {
  try {
    const { templateId, roomData } = req.body;

    const template = await inspectionTemplateModel.findById(templateId);
    if (!template) {
      return res.status(400).send({
        message: "Template not found!",
      });
    }

    const room = template.rooms.id(roomData._id);
    if (!room) {
      return res.status(400).send({
        message: "Room not found!",
      });
    }

    room.name = roomData.name;
    room.imageRequired = roomData.imageRequired;

    if(roomData.elements.length > 0){
      room.elements = roomData.elements.map((element) => ({
        name: element.name,
        imageRequired: element.imageRequired,
        checklist: element.checklist.map((checklistitem) => ({
          text: checklistitem.text,
          options: checklistitem.options? checklistitem.options.map((option) => ({
              option: option.option,
              iconId: option.iconId,
          })) : [],
          type: checklistitem.type? checklistitem.type : "radio",
          answerRequired: checklistitem.answerRequired,
        })),
      }));
    }

    await template.save();

    res.status(201).send({
      message: "Room updated successfully!",
    });

  } catch (err) {
    return res.status(400).send({
      message: "Failed to update room!",
      error: err.message,
    });
  }
};

//Re Arrange Rooms
export const reArrangeRooms = async (req, res) => {
  try {
    const { templateId, roomIds } = req.body;

    const template = await inspectionTemplateModel.findById(templateId);
    if (!template) {
      return res.status(400).send({
        message: "Template not found!",
      });
    }

    const newRooms = roomIds.map((roomId) => template.rooms.id(roomId));
    template.rooms = newRooms;

    await template.save();

    return res.status(200).send({
      message: "Rooms rearranged successfully!",
    });
  } catch (err) {
    return res.status(400).send({
      message: "Failed to rearrange rooms!",
      error: err.message,
    });
  }
};

//Re Arrange Elements
export const reArrangeElements = async (req, res) => {
  try {
    const { templateId, roomId, elementIds } = req.body;

    const template = await inspectionTemplateModel.findById(templateId);
    if (!template) {
      return res.status(400).send({
        message: "Template not found!",
      });
    }

    const room = template.rooms.id(roomId);
    if (!room) {
      return res.status(400).send({
        message: "Room not found!",
      });
    }

    const newElements = elementIds.map((elementId) => room.elements.id(elementId));
    room.elements = newElements;

    await template.save();

    return res.status(200).send({
      message: "Elements rearranged successfully!",
    });
  }
  catch (err) {
    return res.status(400).send({
      message: "Failed to rearrange elements!",
      error: err.message,
    });
  }
};

//Save Template as Draft
export const saveTemplateAsDraft = async (req, res) => {
  try {
    const { templateId } = req.body;

    const template = await inspectionTemplateModel.findById(templateId);
    if (!template) {
      return res.status(400).send({
        message: "Template not found!",
      });
    }

    template.isDraft = true;

    await template.save();

    return res.status(200).send({
      message: "Template saved as draft successfully!",
    });

  }
  catch (err) {
    return res.status(400).send({
      message: "Failed to save template draft!",
      error: err.message,
    });
  }
}

//Save Template as Complete
export const saveTemplateAsComplete = async (req, res) => {
  try {
    const { templateId } = req.body;

    const template = await inspectionTemplateModel.findById(templateId);
    if (!template) {
      return res.status(400).send({
        message: "Template not found!",
      });
    }

    template.isDraft = false;

    await template.save();

    return res.status(200).send({
      message: "Template saved as complete successfully!",
    });
  }
  catch (err) {
    return res.status(400).send({
      message: "Failed to save template complete!",
      error: err.message,
    });
  }
}

export const deleteTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;

    const template = await inspectionTemplateModel.findById(templateId);
    if (!template) {
      return res.status(400).send({
        message: "Template not found!",
      });
    }

    template.isDeleted = true;

    await template.save();

    await userActivityModel.create({
      user: template.user,
      activity: `You archived template named ${template.name}`,
    });

    return res.status(200).send({
      message: "Template deleted successfully!",
    });

  } catch (err) {
    return res.status(400).send({
      message: "Failed to delete template!",
      error: err.message,
    });
  }
}

