import userModel from "../models/userModel.js";
import subUserModel from "../models/subUserModel.js";
import inspectionModel from "../models/inspectionModel.js";
import propertyModel from "../models/propertyModel.js";
import { createHmac } from "crypto";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "../services/imageService.js";
import { createTokensForUser } from "../services/auth.js";
import { getPdfCounts } from "../services/pdfCount.js";
import fs from "fs";
import userActivityModel from "../models/userActivityModel.js";
// Add Personal Details and Update User Database
export const addPersonalDetails = async (req, res) => {
  const { userPhoneNumber, userEmail } = req.body;

  try {
    const user = await userModel.findOne({ email: userEmail });


    // console.log("User: ", user);

    if (!user) {
      return res.status(400).send({
        message: "User not found!",
      });
    }

    if (req.file)
    {

      // console.log("File: ", req.file);

      if (user.profilePicture && user.profilePicture.publicId && user.profilePicture.publicId !== "") {
        // console.log("Image already exists in Cloudinary");
        await deleteImageFromCloudinary(user.profilePicture.publicId);
        // console.log("Image deleted from Cloudinary");
      }
      // console.log("Uploading image to Cloudinary");
      const uploadedImage = await uploadImageToCloudinary(req.file.path, user._id);
      // console.log("Image uploaded to Cloudinary");
      // console.log("File path: ", req.file.path);
      fs.unlinkSync(req.file.path);
      // console.log("File deleted from server");

      if (!uploadedImage) {
        return res.status(400).send({
          message: "Image upload failed!",
        });
      }

      // console.log("Uploaded image: ", uploadedImage);

      user.profilePicture.url = uploadedImage.url;
      user.profilePicture.publicId = uploadedImage.public_id;

    }

    user.personalPhoneNumber = userPhoneNumber;

    // console.log("User: ", user);
    // await user.validate();
    await user.save();
    // console.log("User saved to database");

    return res.status(201).send({
      message: "Personal details added successfully!",
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    return res.status(400).send({
      message: "Failed to add personal details!",
      error: err.message,
    });
  }
};

// Add Business Details and Update User Database

export const addBusinessDetails = async (req, res) => {
  const {
    businessName,
    businessAddress,
    businessPhoneNumber,
    businessWebsite,
    userEmail,
  } = req.body;

  try {
    const user = await userModel.findOne({ email: userEmail });

    if (!user) {
      return res.status(400).send({
        message: "User not found!",
      });
    }

    // Update user's business details
    const updateUser = await userModel.updateOne(
      {
        email: userEmail,
      },
      {
        $set: {
          businessName,
          businessAddress,
          businessPhoneNumber,
          businessWebsite,
        },
      },
      { new: true }
    );
    

    return res.status(201).send({
      message: "Business details added successfully!",
      userDetails:{
        ...user["_doc"],
        salt: undefined,
        password: undefined,
      }
    });
  } catch (err) {
    return res.status(400).send({
      message: "Failed to add business details!",
      error: err.message,
    });
  }
};

// Fetch User Details
export const fetchUserDetails = async (req, res) => {
  // Get user id from middleware response
  const { _id, role } = req.user;

  try {
    let user;
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

    user = await userModel.findById(userid);

    if (!user) {
      user = await subUserModel.findById(userid);

      if (!user) {
        return res.status(400).send({
          message: "User not found!",
        });
      }
    }

    return res.status(200).send({
      message: "User details retrieved successfully!",
      userDetails: {
        ...user["_doc"],
        salt: undefined,
        password: undefined,
      },
    });
  } catch (err) {
    return res.status(400).send({
      message: "Failed to retrieve user details!",
      error: err.message,
    });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  // Get user id from middleware response
  const { _id, role } = req.user;

  const { currentPassword, newPassword } = req.body;

  try {
    // Get user details
    let user;
    if (role === "SUBUSER") {
      user = await subUserModel.findById(_id);
    } else {
      user = await userModel.findById(_id);
    }

    if (!user) {
      return res.status(400).send({
        message: "User not found!",
      });
    }

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
      .update(currentPassword)
      .digest("hex");

    if (hashedPassword !== userProvidedHash) {
      return res.status(400).send({
        message: "Current password is incorrect!",
      });
    }

    // Update user's password and save to database
    user.password = newPassword;
    await user.save();

    return res.status(201).send({
      message: "Password changed successfully!",
      userDetails: {
        ...user["_doc"],
        salt: undefined,
        password: undefined,
      },
    });
  } catch (err) {
    return res.status(400).send({
      message: "Failed to change password!",
      error: err.message,
    });
  }
};

// Change Personal Info
export const changePersonalInfo = async (req, res) => {
  const { _id } = req.user;
  const { fullname, personalPhoneNumber } = req.body;

  try {
    // Find the user to check if it exists
    const user = await userModel.findById(_id);
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    // Preparing the update payload
    const updatePayload = {
      fullname,
      personalPhoneNumber,
    };

    if (req.file) {
      try {
        // Delete the old profile picture if it exists
        if (user.profilePicture?.publicId) {
          await deleteImageFromCloudinary(user.profilePicture.publicId);
        }

        // Upload the new profile picture
        const uploadedImage = await uploadImageToCloudinary(req.file.path, user._id);

        fs.unlinkSync(req.file.path);

        // Add the profile picture to the update payload
        user.profilePicture.url = uploadedImage.url;
        user.profilePicture.publicId = uploadedImage.public_id;

        await user.save();

      } catch (imageError) {
        console.error('Error updating profile picture:', imageError.message);
        throw new Error('Failed to update profile picture.');
      }
    }

    const updatedUser = await userModel.findByIdAndUpdate(_id, updatePayload, {
      new: true, // Return the updated document
    });

    return res.status(200).send({
      message: "Personal info updated successfully!",
      userDetails: {
        ...updatedUser["_doc"],
        salt: undefined,
        password: undefined,
      },
    });
  } catch (err) {
    console.error('Error updating personal info:', err.message);
    return res.status(500).send({
      message: "Failed to update personal info!",
      error: err.message,
    });
  }
};

// Change Business Info
export const changeBusinessInfo = async (req, res) => {
  const { _id } = req.user; 
  const { businessName, businessAddress, businessPhoneNumber, businessWebsite } = req.body;

  try {
    // Find the user to check if it exists
    const user = await userModel.findById(_id);
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    // Prepare the update payload
    const updatePayload = {
      businessName,
      businessAddress,
      businessPhoneNumber,
      businessWebsite,
    };

    if (req.file) {
      try {
        // Delete the old business logo if it exists
        if (user.businessLogo?.publicId) {
          await deleteImageFromCloudinary(user.businessLogo.publicId);
        }

        // Upload the new business logo
        const uploadedImage = await uploadImageToCloudinary(req.file.path, user._id);

        fs.unlinkSync(req.file.path);

        user.businessLogo.url = uploadedImage.url;
        user.businessLogo.publicId = uploadedImage.public_id;

        await user.save();

      } catch (imageError) {
        return res.status(500).send({ message: "Failed to update business logo", error: imageError.message });
      }
    }

    const updatedUser = await userModel.findByIdAndUpdate(_id, updatePayload, {
      new: true, // Return the updated document
    });

    return res.status(200).send({
      message: "Business info updated successfully!",
      userDetails: {
        ...updatedUser["_doc"],
        salt: undefined,
        password: undefined,
      },
    });
  } catch (err) {
    return res.status(500).send({
      message: "Failed to update business info!",
      error: err.message,
    });
  }
};


// Change Role
export const changeRole = async (req, res) => {
  // Get user id from middleware response
  const { _id } = req.user;

  const { role, deviceType } = req.body;

  try {

    if (role !== "FREETIER" && role !== "STANDARDTIER" && role !== "TOPTIER") {
      return res.status(400).send({
        message: "Invalid role!",
      });
    }

    // Get user details
    const user = await userModel.findById(_id);

    if (!user) {
      return res.status(400).send({
        message: "User not found!",
      });
    }

    // Update user's role and save to database
    const updatedUser = await userModel.findByIdAndUpdate(
      _id,
      {
        role,
      },
      { new: true } // Option to return the updated document
    );

    const { accessToken } = createTokensForUser(updatedUser, deviceType);
    res.cookie("accessToken", accessToken);

    return res.status(201).send({
      message: "Role changed successfully!",
      userDetails: {
        ...updatedUser["_doc"],
        salt: undefined,
        password: undefined,
      },
    });
  } catch (err) {
    return res.status(400).send({
      message: "Failed to change role!",
      error: err.message,
    });
  }
};

export const getUserInspectionAndPropertyData = async (req, res) => {

  try
  {
    const { _id, role } = req.user;
    let pdfsGeneratedThisMonth = 0;
    let pdfsGeneratedAlltime = 0;
    let totalInspectionCount = 0;
    let totalCompletedInspectionCount = 0;
    let remainingInspectionCount = 0;

    let totalPropertyCount = 0;
    let propertiesAddedByYou = 0;
    let propertiesAssigned = 0


    if (role === "SUBUSER") 
    {
      const subUser = await subUserModel.findById(_id);
      totalInspectionCount = await inspectionModel.countDocuments({ subUser: _id, isDeleted: false });
      totalCompletedInspectionCount = await inspectionModel.countDocuments({ subUser: _id, isInspectionCompleted: true, isDeleted: false });
      totalPropertyCount = await propertyModel.countDocuments({ subUser: _id, isDeleted: false});
      propertiesAddedByYou = totalPropertyCount;
      pdfsGeneratedThisMonth = await getPdfCounts("monthly", subUser.manager);
      pdfsGeneratedAlltime = await getPdfCounts("alltime", subUser.manager);
      remainingInspectionCount = -1;

      //find count of properties based on all assigned categories in subuser from top user's properties
      propertiesAssigned = await propertyModel.countDocuments({ owner: subUser.manager, isDeleted: false, category: { $in: subUser.assignedCategories } });

    }
    else
    {
      totalInspectionCount = await inspectionModel.countDocuments({ user: _id, isDeleted: false, subUser: { $exists: false } });
      totalCompletedInspectionCount = await inspectionModel.countDocuments({ user: _id, isInspectionCompleted: true, isDeleted: false, subUser: { $exists: false } });
      totalPropertyCount = await propertyModel.countDocuments({ owner: _id, isDeleted: false});
      propertiesAddedByYou = await propertyModel.countDocuments({ owner: _id, isDeleted: false, subUser: { $exists: false } });
      pdfsGeneratedThisMonth = await getPdfCounts("monthly", _id);
      pdfsGeneratedAlltime = await getPdfCounts("alltime", _id);
      remainingInspectionCount = -999;

      if (role == "FREETIER")
      {
        remainingInspectionCount = 1 - totalInspectionCount;
        propertiesAssigned = 0;
      }
      else if (role == "STANDARDTIER")
      {
        remainingInspectionCount = 10 - totalInspectionCount;
        propertiesAssigned = 0;
      }
      else if (role == "TOPTIER")
      {
        const topTierAssignedCategories = await subUserModel.find({ manager: _id, assignedCategories: { $exists: true } });

        const uniqueAssignedCategories = [
          ...new Set(topTierAssignedCategories.flatMap(subUser => subUser.assignedCategories))
        ];

        propertiesAssigned = await propertyModel.countDocuments({ owner: _id, isDeleted: false, category: { $in: uniqueAssignedCategories } });

      }

    }

    return res.status(200).send({
      message: "User inspection and property data fetched successfully!",
      totalInspectionCount,
      totalCompletedInspectionCount,
      totalPropertyCount,
      propertiesAddedByYou,
      propertiesAssigned,
      remainingInspectionCount,
      pdfsGeneratedThisMonth,
      pdfsGeneratedAlltime
    })

  }
  catch(err)
  {
    console.log(err);
    return res.status(400).send({
      message: "Failed to get user inspection and property data!",
      error: err.message,
    });
  }

};

export const getCollaboratorPendingSignatureData = async (req, res) => {

  try
  {
    const { _id, role } = req.user;
    const {page = 1, limit = 10} = req.query;

    let pendingInspections = [];
    let unSignedCollaborators = [];

    if (role == "SUBUSER")
    {
      pendingInspections = await inspectionModel.find({ subUser: _id, isDeleted: false, isDraft: false, isInspectionCompleted: false });
    }
    else
    {
      pendingInspections = await inspectionModel.find({ user: _id, isDeleted: false, isDraft: false, isInspectionCompleted: false });
    }

    // Extract unsigned collaborators from pending inspections
    unSignedCollaborators = pendingInspections.flatMap((inspection) => {
      const { collaborators, inspectionDate, name: inspectionName } = inspection;
      return collaborators
        .filter(
          (collaborator) => collaborator.signatureNotRequired == false && !collaborator.signature?.url !== ""
        )
        .map((collaborator) => ({
          collaboratorName: collaborator.name,
          collaboratorEmail: collaborator.email,
          profileURL: "",
          inspectionDate,
          inspectionName,
        }));
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedCollaborators = unSignedCollaborators.slice(startIndex, endIndex);

    for (let collaborator of paginatedCollaborators)
    {
      let existingUser = await userModel.findOne({ email: collaborator.collaboratorEmail });
      if (existingUser)
      {
        collaborator.profileURL = existingUser.profilePicture?.url;
      }
      else
      {
        let existingSubUser = await subUserModel.findOne({ email: collaborator.collaboratorEmail });  
        if (existingSubUser)
        {
          collaborator.profileURL = existingSubUser.profilePicture?.url;
        }
      }
    }

    // Send response with pagination metadata
    return res.status(200).send({
      page: parseInt(page),
      totalCollaborators: unSignedCollaborators.length,
      totalPages: Math.ceil(unSignedCollaborators.length / limit),
      collaborators: paginatedCollaborators,
    });

  }
  catch(err)
  {
    console.log(err);
    return res.status(400).send({
      message: "Failed to get collaborator pending signature data!",
      error: err.message,
    });
  }
}

export const getActivityFeed = async (req, res) => {

  try
  {
    const { _id, role } = req.user;
    const {page = 1, limit = 10, filter = ""} = req.query;

    let activityFeed = [];
    let query = {};
    let currentDay = new Date();
    currentDay.setHours(0, 0, 0, 0);


    if (role == "SUBUSER")
    {
      query.subUser = _id;
    }
    else
    {
      query.user = _id;
    }

    if (filter == "recent")
    {
      query.date = { $gte: currentDay };
    }
    else if (filter == "yesterday")
    {
      const startOfYesterday = new Date(currentDay);
      startOfYesterday.setDate(startOfYesterday.getDate() - 1);

      const endOfYesterday = new Date(currentDay);
      query.date = { $gte: startOfYesterday, $lte: endOfYesterday };

    } else if (filter === "lastweek") {

      const startOfLastWeek = new Date(currentDay);
      startOfLastWeek.setDate(startOfLastWeek.getDate() - startOfLastWeek.getDay() - 7);

      const endOfLastWeek = new Date(currentDay);
      endOfLastWeek.setDate(endOfLastWeek.getDate() - endOfLastWeek.getDay());

      query.date = { $gte: startOfLastWeek, $lt: endOfLastWeek };
      
  } else if (filter === "lastmonth") {
      const startOfLastMonth = new Date(currentDay);
      startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
      startOfLastMonth.setDate(1);
      startOfLastMonth.setHours(0, 0, 0, 0);

      const endOfLastMonth = new Date(startOfLastMonth);
      endOfLastMonth.setMonth(endOfLastMonth.getMonth() + 1);
      endOfLastMonth.setDate(1);
      endOfLastMonth.setHours(0, 0, 0, 0);

      query.date = { $gte: startOfLastMonth, $lt: endOfLastMonth };
  }

    activityFeed = await userActivityModel.find(query).sort({ date: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    const totalActivityFeed = await userActivityModel.find(query).countDocuments();

    return res.status(200).send({
      message: "Activity feed fetched successfully!",
      activityFeed,
      page: parseInt(page),
      totalActivityFeed,
      totalPages: Math.ceil(totalActivityFeed / limit),
    })

  }
  catch(err)
  {
    console.log(err);
    return res.status(400).send({
      message: "Failed to get activity feed!",
      error: err.message,
    });
  }
};

export const getAllActivityFeed = async (req, res) => {
  try {
    const { _id, role } = req.user;

    const page = 1;
    const limit = 4;

    let currentDay = new Date();
    currentDay.setHours(0, 0, 0, 0);

    const startOfYesterday = new Date(currentDay);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const endOfYesterday = new Date(currentDay);

    const startOfLastWeek = new Date(currentDay);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - startOfLastWeek.getDay() - 7);
    const endOfLastWeek = new Date(currentDay);

    const startOfLastMonth = new Date(currentDay);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    startOfLastMonth.setDate(1);
    startOfLastMonth.setHours(0, 0, 0, 0);

    const endOfLastMonth = new Date(startOfLastMonth);
    endOfLastMonth.setMonth(endOfLastMonth.getMonth() + 1);
    endOfLastMonth.setDate(1);
    endOfLastMonth.setHours(0, 0, 0, 0);

    const getQuery = (startDate, endDate) => {
      const query = { date: { $gte: startDate, $lt: endDate } };
      if (role === "SUBUSER") {
        query.subUser = _id;
      } else {
        query.user = _id;
      }
      return query;
    };

    // Fetch activities for each time period
    const recentActivities = userActivityModel.find(getQuery(currentDay, new Date()))
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const yesterdayActivities = userActivityModel.find(getQuery(startOfYesterday, endOfYesterday))
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const lastWeekActivities = userActivityModel.find(getQuery(startOfLastWeek, endOfLastWeek))
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const lastMonthActivities = userActivityModel.find(getQuery(startOfLastMonth, endOfLastMonth))
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const activities = await Promise.all([
      recentActivities,
      yesterdayActivities,
      lastWeekActivities,
      lastMonthActivities
    ]);

    return res.status(200).send({
      message: "Activity feed fetched successfully!",
      recentActivities: activities[0],
      yesterdayActivities: activities[1],
      lastWeekActivities: activities[2],
      lastMonthActivities: activities[3],
    });

  } catch (err) {
    console.log(err);
    return res.status(400).send({
      message: "Failed to get activity feed!",
      error: err.message,
    });
  }
};

