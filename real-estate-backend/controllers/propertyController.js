import propertyModel from "../models/propertyModel.js";
import userModel from "../models/userModel.js";
import subUserModel from "../models/subUserModel.js";
import inspectionModel from "../models/inspectionModel.js";
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "../services/imageService.js";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import userActivityModel from "../models/userActivityModel.js";

// Create Property
export const createProperty = async (req, res) => {
    const { name, referenceID, category, address } = req.body;

    var categoryObj = JSON.parse(category);

    if (categoryObj.value === "" || categoryObj.iconId === "" || categoryObj.value === null || categoryObj.iconId === null) {
      return res.status(400).send({
        message: "Category is required!",
      });
      
    }
    var addressObj = JSON.parse(address);

    console.log(name, referenceID, categoryObj, addressObj);
    const { _id, role } = req.user;

    if (!req.file) {
      return res.status(400).send({
          message: "No image uploaded!",
      });
    }
  
    try {

      let ownerid;
      let subUserid;
      let user;

      if (role === 'SUBUSER')
      {
        const subUser = await subUserModel.findById(_id)
        user = subUser;
        ownerid = subUser.manager;
        subUserid = _id;
      }
      else
      {
        ownerid = _id;
        subUserid = null;
        user = await userModel.findById(_id);
      }

      const newProperty = new propertyModel({
        name,
        address: addressObj,
        category: {
          value: categoryObj.value,
          iconId: categoryObj.iconId,
        },
        owner: ownerid,

        ...(role === "SUBUSER" && { subUser: subUserid })
      });
  
      // Set referenceID based on whether it's provided or needs to be generated
      if (referenceID !== "") {
        console.log("referenceID: ", referenceID);
        newProperty.referenceId = referenceID;
        newProperty.isIDGenerated = false;
      } 
      else 
      {
        const uniqueID = uuidv4();
        newProperty.referenceId = uniqueID;
        newProperty.isIDGenerated = true;
      }

      await newProperty.save();

      const uploadedImage = await uploadImageToCloudinary(req.file.path, `${newProperty.owner.toString()}/${newProperty._id.toString()}`);

      newProperty.image = {
        publicId: uploadedImage.public_id,
        url: uploadedImage.url,
      };

      // console.log("New Property: ", newProperty);
      fs.unlinkSync(req.file.path);
  
      // Save the property to the database
      await newProperty.save();

      if (role === "SUBUSER") {
        await userActivityModel.create({
          user: ownerid,
          subUser: subUserid,
          activity: `Sub User ${user.fullname} created a property named ${name}`,
          subActivity: `You created a property named ${name}`,
        })
      }
      else {
        await userActivityModel.create({
          user: ownerid,
          activity: `You created a property named ${name}`,
        })
      }
  
      return res.status(201).send({
        message: "Property created successfully!",
        property: newProperty,
      });
    } catch (err) {
      return res.status(400).send({
        message: "Failed to create property!",
        error: err.message,
      });
    }
};


//Edit Existing Property
export const editExistingProperty = async (req, res) => {
    const { id, name, referenceId, category, address } = req.body;
    const { _id, role } = req.user;
  
    try {

      var categoryObj = JSON.parse(category);
      var addressObj = JSON.parse(address);

      const property = await propertyModel.findById(id);
  
      if (!property) {
        return res.status(404).send({
          message: "Property not found!",
        });
      }
  
      property.name = name;
      if (referenceId !== "") {

        //make sure the referenceId is unique
        const propertyWithReferenceId = await propertyModel.findOne({ referenceId : referenceId });
        if (propertyWithReferenceId) {
          return res.status(400).send({
            message: "Reference ID already exists, It must be Unique!",
          });
        }
  
        property.referenceId = referenceId;
        property.isIDGenerated = false
      }

      property.category = {
        value: categoryObj.value,
        iconId: categoryObj.iconId,
      };
      property.address = addressObj;
      
      if (req.file) {
        if (property.image && property.image.publicId && property.image.publicId !== "") {
          await deleteImageFromCloudinary(property.image.publicId);

          property.image.publicId = "";
          property.image.url = "";
        }

        const uploadedImage = await uploadImageToCloudinary(req.file.path, `${property.owner.toString()}/${property._id.toString()}`);
        property.image = {
          publicId: uploadedImage.public_id,
          url: uploadedImage.url,
        };

        fs.unlinkSync(req.file.path);
      }
  
      await property.save();

      if (role === "SUBUSER") {
        const subUser = await subUserModel.findById(_id);
        await userActivityModel.create({
          user: property.owner,
          subUser: property.subUser,
          activity: `Sub User ${subUser.fullname} edited a property named ${property.name}`,
          subActivity: `You edited a property named ${property.name}`,
        })
      }
      else {
        await userActivityModel.create({
          user: property.owner,
          activity: `You edited a property named ${property.name}`,
        })
      }
  
      return res.status(200).send({
        message: "Property updated successfully!",
        property,
      });
    } catch (err) {
      return res.status(500).send({
        message: "Failed to update property!",
        error: err.message,
      });
    }
  };

  export const getProperties = async (req, res) => {

    const { _id, role } = req.user;
  
    try {
      let properties;
  
      // get properties by id while returning its name, id and address
      if (role === "SUBUSER") {
        const subUser = await subUserModel.findById(_id);
        properties = await propertyModel.find({ owner: subUser.manager, subUser: { $exists: false }, isDeleted: false });
        const subUserProperties = await propertyModel.find({ owner: subUser.manager, subUser: _id, isDeleted: false });

        properties = properties.concat(subUserProperties);
        
      } else {
        properties = await propertyModel.find({ owner: _id, isDeleted: false });
      }
  
      return res.status(200).send({
        message: "Properties fetched successfully!",
        properties,
      });
    } catch (err) {
      return res.status(500).send({
        message: "Failed to fetch properties!",
        error: err.message,
      });
    }
  };

// create get property API with pagination, returning property name, id, and address, image url, category, creationdate, last inspection Date
export const getCompleteProperties = async (req, res) => {

  try {

    const limit = 10;
    const { _id, role } = req.user;
    const { category, page = 1, search, startDate, endDate } = req.body;

    let properties = [];
    let query;
    let userid = _id;

    if (role === "superAdmin") {
      let { id } = req.query;
      if (!id) {
        return res.status(400).send({
          message: "User not found!",
        });
      }
      userid = id;
    }
    else if (role === "SUBUSER") {
      const subUser = await subUserModel.findById(userid);
      // Use $or to match either of the two conditions
      query = {
          $or: [
              { owner: subUser.manager, subUser: { $exists: false } }, // user: subUser.manager, but no subUser field
              { owner: subUser.manager, subUser: userid } // user: subUser.manager and subUser: _id
          ]
      };
    }
    else {
      query = { owner: userid };
    }

    query.isDeleted = false

    // Add category to the query if it's provided, category is a nested object we need to access the value field
    if (category !== "") {
      query["category.value"] = category;
    }

    if (search !== "") {
      query.name = { $regex: search, $options: "i" };
    }

    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lt: new Date(endDate) };
    }

    properties = await propertyModel
    .find(query)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));


    const totalProperties = await propertyModel.countDocuments(query);

    // Convert properties to plain JavaScript objects to add custom fields
    properties = properties.map(property => property.toObject());

    // Loop through each property to find the last inspection date
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];

      // Find the latest inspection based on the inspection date
      const lastInspection = await inspectionModel
        .findOne({ property: property._id })
        .sort({ inspectionDate: -1 });

      // Add lastInspectionDate to the property if an inspection is found
      properties[i].lastInspectionDate = lastInspection ? lastInspection.inspectionDate : null;
    }


    return res.status(200).send({
      message: "Properties fetched successfully!",
      properties,
      totalProperties,
      totalPages: Math.ceil(totalProperties / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    return res.status(500).send({
      message: "Failed to fetch properties!",
      error: err.message,
    });
  }
};

//get property by id
export const getPropertyById = async (req, res) => {
    const propertyId = req.params.id;
    const { _id } = req.user;
  
    try {
      const property = await propertyModel.findById(propertyId);
  
      if (!property) {
        return res.status(404).send({
          message: "Property not found!",
        });
      }

      //get all inspection related to the property
      const inspections = await inspectionModel.find({ property: propertyId });

      //count of all the inspections
      const inspectionCount = inspections.length;

      // get the number of days passed since the last inspection
      let daysSinceLastInspection = "No Inspections Yet";
      if (inspectionCount > 0) {
        const lastInspection = inspections[inspectionCount - 1];
        const lastInspectionDate = lastInspection.createdAt;
        const currentDate = new Date();
        const timeDifference = currentDate.getTime() - lastInspectionDate.getTime();
        daysSinceLastInspection = Math.floor(timeDifference / (1000 * 3600 * 24));
      }

      //get the number of days passed since the the last "completed" inspection based on the an inspection's isInspectionCompleted field

      let daysSinceLastCompletedInspection = "No Completed Inspections Yet";
      if (inspectionCount > 0) {
        // Filtering completed inspections and sort them by date in descending order
        const completedInspections = inspections
          .filter(inspection => inspection.isInspectionCompleted === true)
          .sort((a, b) => b.inspectionDate - a.inspectionDate);
        
        // Getting the most recent completed inspection
        const lastCompletedInspection = completedInspections[0];
      
        if (lastCompletedInspection) {
          const lastCompletedInspectionDate = lastCompletedInspection.inspectionDate;
          const currentDate = new Date();
          const timeDifference = currentDate.getTime() - lastCompletedInspectionDate.getTime();
          daysSinceLastCompletedInspection = Math.floor(timeDifference / (1000 * 3600 * 24));
        }
      }

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
      

      return res.status(200).send({
        message: "Property fetched successfully!",
        property,
        totalInspections: inspectionCount,
        daysSinceLastInspection,
        daysSinceLastCompletedInspection,
        relatedInspections,
      });
    } catch (err) {
      return res.status(500).send({
        message: "Failed to fetch property!",
        error: err.message,
      });
    }
  };

//delete property api using _id
  export const deleteProperty = async (req, res) => {
    const propertyId = req.params.id;
    const { _id } = req.user;
  
    try {
      
      const property = await propertyModel.findById(propertyId);
  
      if (!property) {
        return res.status(404).send({
          message: "Property not found!",
        });
      }
  
      if (property.owner.toString() !== _id.toString()) {
        return res.status(403).send({
          message: "You are not authorized to delete this property!",
        });
      }

      // Set isDeleted to true to for all inspections related to the property
      await inspectionModel.updateMany({ property: propertyId }, { $set: { isDeleted: true } });
  
      // Set isDeleted to true for the property
      await propertyModel.updateOne({ _id: propertyId }, { $set: { isDeleted: true } });

      await userActivityModel.create({
        user: _id,
        activity: `You archived ${property.name} Property successfully!`,
      });

  
      return res.status(200).send({
        message: "Property deleted successfully!",
      });
      
    } catch (err) {
      return res.status(500).send({
        message: "Failed to delete property!",
        error: err.message,
      });
    }
  };
  
