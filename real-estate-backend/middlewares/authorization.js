import userModel from "../models/userModel.js";
import subUserModel from "../models/subUserModel.js";
import superAdminModel from "../models/superAdminModel.js";
import propertyModel from "../models/propertyModel.js";
import inspectionModel from "../models/inspectionModel.js";
import inspectionTemplateModel from "../models/inspectionTemplateModel.js";
import { Types } from 'mongoose';

export const topTierAuthorization = async (req, res, next) => {
    const { _id, role } = req.user;

    try {
        const user = await userModel.findById(_id);
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }
        if (user.role !== "TOPTIER" || role !== "TOPTIER") {
            return res.status(403).json({
                message: "You are not authorized to perform this operation without Top Tier User privileges!",
            });
        }
        next();
    } catch (err) {
        console.log(err);
        return res.status(403).json({ message: 'Authorization Failed', error: err.message });
    }
};

export const superAdminAuthorization = async (req, res, next) => {
    const { _id, role } = req.user;

    try {
        const superAdmin = await superAdminModel.findById(_id);
        if (!superAdmin) {
            return res.status(403).json({ message: 'You are not authorized to perform this operation without having Super Admin privileges!' });
        }
        if (superAdmin.role !== "superAdmin" || role !== "superAdmin") {
            return res.status(403).json({
                message: "You are not authorized to perform this operation without Super Admin privileges!",
            });
        }
        next();
    } catch (err) {
        console.log(err);
        return res.status(403).json({ message: 'Authorization Failed', error: err.message });
    }
};

export const subUserAuthorization = async (req, res, next) => {
    const { _id, role } = req.user;

    try {
        const user = await subUserModel.findById(_id);
        if (!user) {
            return res.status(403).json({ message: 'Sub User not found' });
        }
        if (user.role !== "SUBUSER" || role !== "SUBUSER") {
            return res.status(403).json({
                message: "You are not authorized to perform this operation without Sub User privileges!",
            });
        }
        next();
        
    } catch (err) {
        console.log(err);
        return res.status(403).json({ message: 'Authorization Failed', error: err.message });
    }
};

export const subUserManagerExpiryAuthorization = async (req, res, next) => {
    try
    {
        const { _id, role } = req.user;

        if (role === "SUBUSER")
        {
            const subUser = await subUserModel.findById(_id);
            if (!subUser) {
                return res.status(401).json({ message: 'Sub User not found' });
            }

            const manager = await userModel.findById(subUser.manager);

            if (!manager) {
                return res.status(401).json({ message: 'Manager not found' });
            }

            if (manager.role !== 'TOPTIER')
            {
                return res.status(403).json({
                    message: "Your Manager is no longer a Top Tier User and you are no longer authorized to perform this operation!",
                });
            }

        }

        next();

    }
    catch(err)
    {
        console.log(err);
        return res.status(403).json({ message: 'Authorization Failed', error: err.message });
    }   
}

export const categoryAuthorization = async (req, res, next) => {
    try
    {
        const { _id, role } = req.user;

        if (role === "SUBUSER")
        {
            const subUser = await subUserModel.findById(_id);
            if (!subUser) {
                return res.status(401).json({ message: 'Sub User not found' });
            }

            const manager = await userModel.findById(subUser.manager);

            if (!manager) {
                return res.status(401).json({ message: 'Manager not found' });
            }

            if (manager.role !== 'TOPTIER')
            {
                return res.status(403).json({
                    message: "Your Manager is no longer a Top Tier User and you are no longer authorized to perform this operation!",
                });
            }

        }  
        else if (role !== "TOPTIER" && role !== "STANDARDTIER" && role !== "FREETIER")
        {
            return res.status(403).json({
                message: "You are not authorized to perform this operation with role: " + role,
            });
        }

        next();

    }
    catch(err)
    {
        console.log(err);
        return res.status(403).json({ message: 'Authorization Failed', error: err.message });
    }   
}

export const subUserRestrictionAuthorization = async (req, res, next) => {
    try
    {
        const { _id, role } = req.user;

        if (role === "SUBUSER")
        {
            return res.status(403).json({
                message: "You are not authorized to perform this operation with Sub User privileges!",
            })

        }

        next();

    }
    catch(err)
    {
        console.log(err);
        return res.status(403).json({ message: 'Authorization Failed', error: err.message });
    }   
}

export const propertyCreationTierLimitAuthorization = async (req, res, next) => {
    try
    {
        const { _id, role } = req.user;

        const user = await userModel.findById(_id);
        const subUser = await subUserModel.findById(_id);

        if (!user && !subUser) {
            return res.status(403).json({ message: 'User not found' });
        }

        const userId = user ? user._id : subUser._id;
        const associatedRole = user ? user.role : subUser.role;

        if (associatedRole !== role) {
            return res.status(403).json({
                message: `Un Authorized role, (Inconsistency): ${associatedRole}`,
            })
        }

        if (associatedRole === 'FREETIER')
        {

            const propertyCount = await propertyModel.countDocuments({
                owner: userId,
                isDeleted: false,
            });

            if (propertyCount >= 1)
            {
                return res.status(403).json({
                    message: "You have reached your property limit as a Free Tier User!",
                });
            }

        }
        else if (associatedRole === 'SUBUSER')
        {
            const manager = await userModel.findById(subUser.manager);

            if (manager.role !== 'TOPTIER')
            {
                return res.status(403).json({
                    message: "Your Manager is no longer a Top Tier User and you are no longer authorized to perform this operation!",
                });
            }

        }
        else if (associatedRole !== 'TOPTIER' && associatedRole !== 'STANDARDTIER')
        {
            return res.status(403).json({
                message: `Un Authorized role: ${associatedRole}`,
            })
        }

        next();

    }
    catch(err)
    {
        console.log(err);
        return res.status(403).json({ message: 'Authorization Failed', error: err.message });
    }
};

export const templateCreationTierLimitAuthorization = async (req, res, next) => {
    try
    {
        const { _id, role } = req.user;

        const user = await userModel.findById(_id);
        const subUser = await subUserModel.findById(_id);

        if (!user && !subUser) {
            return res.status(401).json({ message: 'User not found' });
        }

        const userId = user ? user._id : subUser._id;
        const associatedRole = user ? user.role : subUser.role;

        if (associatedRole !== role) {
            return res.status(403).json({
                message: `Un Authorized role, (Inconsistency): ${associatedRole}`,
            })
        }

        if (associatedRole === 'FREETIER')
        {

            const templateCount = await inspectionTemplateModel.countDocuments({
                user: userId,
                isDeleted: false,
            });

            if (templateCount >= 1)
            {
                return res.status(403).json({
                    message: "You have reached your template limit as a Free Tier User!",
                });
            }
        }
        else if (associatedRole === 'STANDARDTIER')
        {
            const templateCount = await inspectionTemplateModel.countDocuments({
                user: userId,
                isDeleted: false,
            });

            if (templateCount >= 3)
            {
                return res.status(403).json({
                    message: "You have reached your template limit as a Standard Tier User!",
                });
            }
        }
        else if (associatedRole !== 'TOPTIER' )
        {
            return res.status(403).json({
                message: `Un Authorized role: ${associatedRole}`,
            })
        }

        next();
    }
    catch(err)
    {
        console.log(err);
        return res.status(403).json({ message: 'Authorization Failed', error: err.message });
    }
};

export const inspectionCreationTierLimitAuthorization = async (req, res, next) => {
    try
    {
        const { _id, role } = req.user;

        const user = await userModel.findById(_id);
        const subUser = await subUserModel.findById(_id);

        if (!user && !subUser) {
            return res.status(401).json({ message: 'User not found' });
        }

        const userId = user ? user._id : subUser._id;
        const associatedRole = user ? user.role : subUser.role;

        if (associatedRole !== role) {
            return res.status(403).json({
                message: `Un Authorized role, (Inconsistency): ${associatedRole}`,
            })
        }

        if (associatedRole === 'FREETIER')
        {

            var inspectionCount = await inspectionModel.countDocuments({
                user: userId,
                isDeleted: false,
            });

            if (inspectionCount >= 1)
            {
                return res.status(403).json({
                    message: "You have reached your inspection limit as a Free Tier User!",
                });
            }
        }
        else if (associatedRole === 'STANDARDTIER')
        {
            var inspectionCount = await inspectionModel.countDocuments({
                user: userId,
                isDeleted: false,
            });

            if (inspectionCount >= 10)
            {
                return res.status(403).json({
                    message: "You have reached your inspection limit as a Standard Tier User!",
                });
            }
        }
        else if (associatedRole === 'SUBUSER')
        {

            const manager = await userModel.findById(subUser.manager);

            if (manager.role !== 'TOPTIER')
            {
                return res.status(403).json({
                    message: "Your Manager is no longer a Top Tier User and you are no longer authorized to perform this operation!",
                });
            }

        }
        else if (associatedRole !== 'TOPTIER')
        {
            return res.status(403).json({
                message: `Un Authorized role: ${associatedRole}`,
            })
        }

        next();

    }
    catch(err)
    {
        console.log(err);
        return res.status(403).json({ message: 'Authorization Failed', error: err.message });
    }
}

export const pdfGenerationTierLimitAuthorization = async (req, res, next) => {
    try
    {
        const { _id, role } = req.user;

        const user = await userModel.findById(_id);
        const subUser = await subUserModel.findById(_id);

        if (!user && !subUser) {
            return res.status(403).json({ message: 'User not found' });
        }

        let userId = user ? user._id : subUser._id;
        const associatedRole = user ? user.role : subUser.role;

        if (associatedRole !== role) {
            return res.status(403).json({
                message: `Un Authorized role, (Inconsistency): ${associatedRole}`,
            })
        }

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(startOfMonth.getMonth() + 1); // Move to the next month
        endOfMonth.setDate(0); // Set to the last day of the current month
        endOfMonth.setHours(23, 59, 59, 999); // Set the time to the last moment of the day

        userId = new Types.ObjectId(userId);

        if (user)
        {
            var monthlyPdfCount = await inspectionModel.aggregate([
                {
                    $match: {
                      user: userId,
                    },
                  },
                  {
                    $project: {
                      pdfReports: {
                        $filter: {
                          input: "$pdfReportUrl",
                          as: "report",
                          cond: {
                            $and: [
                              { $gte: ["$$report.dateGenerated", startOfMonth] }, // after the start of the month
                              { $lt: ["$$report.dateGenerated", endOfMonth] },   // before the end of the month
                            ],
                          },
                        },
                      },
                    },
                  },
                  {
                    $project: {
                      pdfCount: { $size: "$pdfReports" }, // count the number of reports
                    },
                  },
                  {
                    $group: {
                      _id: null,
                      totalPdfExports: { $sum: "$pdfCount" },
                    },
                },
                
            ])
        }

        if (associatedRole === 'FREETIER')
        {

            const pdfExportsThisMonth = monthlyPdfCount.length > 0 ? monthlyPdfCount[0].totalPdfExports : 0;

            if (pdfExportsThisMonth >= 10)
            {
                return res.status(403).json({
                    message: "You have reached your PDF export limit as a Free Tier User!",
                });
            }
        }
        else if (associatedRole === 'STANDARDTIER')
        {

            const pdfExportsThisMonth = monthlyPdfCount.length > 0 ? monthlyPdfCount[0].totalPdfExports : 0;

            if (pdfExportsThisMonth >= 10)
            {
                return res.status(403).json({
                    message: "You have reached your PDF export limit as a Standard Tier User!",
                });
            }
        }
        else if (associatedRole === 'SUBUSER')
        {

            const manager = await userModel.findById(subUser.manager);

            if (manager.role !== 'TOPTIER')
            {
                return res.status(403).json({
                    message: "Your Manager is no longer a Top Tier User and you are no longer authorized to perform this operation!",
                });
            }
        }
        else if (associatedRole !== 'TOPTIER')
        {
            return res.status(403).json({
                message: `Un Authorized role: ${associatedRole}`,
            })
        }

        next();


    }
    catch(err)
    {
        console.log(err);
        return res.status(403).json({ message: 'Authorization Failed', error: err.message });
    }
};

export const templateRoomLimitAuthorization = async (req, res, next) => {
    try
    {
        const { _id, role } = req.user;
        const {templateId} = req.body;

        const user = await userModel.findById(_id);
        const subUser = await subUserModel.findById(_id);

        if (!user && !subUser) {
            return res.status(403).json({ message: 'User not found' });
        }

        const userId = user ? user._id : subUser._id;
        const associatedRole = user ? user.role : subUser.role;

        if (associatedRole !== role) {
            return res.status(403).json({
                message: `Un Authorized role, (Inconsistency): ${associatedRole}`,
            })
        }

        const template = await inspectionTemplateModel.findById(templateId);

        if (!template) {
            return res.status(403).json({ message: 'Template not found' });
        }

        const roomCount = template.rooms.length;

        if (associatedRole === 'FREETIER')
        {
            if (roomCount >= 5)
            {
                return res.status(403).json({
                    message: "You have reached your room limit as a Free Tier User!",
                });
            }
        }
        else if (associatedRole === 'STANDARDTIER')
        {
            if (roomCount >= 10)
            {
                return res.status(403).json({
                    message: "You have reached your room limit as a Standard Tier User!",
                });
            }
        }
        else if (associatedRole == 'TOPTIER')
        {
            if (roomCount >= 25)
            {
                return res.status(403).json({
                    message: "You have reached your room limit as a Top Tier User!",
                });
            }
        }
        else
        {
            return res.status(403).json({
                message: `Un Authorized role: ${associatedRole}`,
            })
        }

        next();
            
    }
    catch(err)
    {
        console.log(err);
        return res.status(403).json({ message: 'Authorization Failed', error: err.message });
    }
}

export const templateElementLimitAuthorization = async (req, res, next) => {
    try
    {
        const { _id, role } = req.user;
        const {templateId, roomId} = req.body;

        const user = await userModel.findById(_id);
        const subUser = await subUserModel.findById(_id);

        if (!user && !subUser) {
            return res.status(403).json({ message: 'User not found' });
        }

        const associatedRole = user ? user.role : subUser.role;

        if (associatedRole !== role) {
            return res.status(403).json({
                message: `Un Authorized role, (Inconsistency): ${associatedRole}`,
            })
        }

        const template = await inspectionTemplateModel.findById(templateId);
        if (!template) {
            return res.status(403).json({ message: 'Template not found' });
        }

        const room = template.rooms.id(roomId);
        if (!room) {
            return res.status(403).json({ message: 'Room not found' });
        }

        if (associatedRole === 'FREETIER')
        {
            if (room.elements.length >= 5)
            {
                return res.status(403).json({
                    message: "You have reached your element limit as a Free Tier User!",
                });
            }
        }
        else if (associatedRole === 'STANDARDTIER')
        {
            if (room.elements.length >= 10)
            {
                return res.status(403).json({
                    message: "You have reached your element limit as a Standard Tier User!",
                });
            }
        }
        else if (associatedRole !== 'TOPTIER')
        {
            return res.status(403).json({
                message: `Un Authorized role: ${associatedRole}`,
            })
        }

        next();
            
    }
    catch(err)
    {
        console.log(err);
        return res.status(403).json({ message: 'Authorization Failed', error: err.message });
    }
}

export const inspectionRoomLimitAuthorization = async (req, res, next) => {
    try
    {
        const { _id, role } = req.user;
        const {inspectionId} = req.body;

        const user = await userModel.findById(_id);
        const subUser = await subUserModel.findById(_id);

        if (!user && !subUser) {
            return res.status(403).json({ message: 'User not found' });
        }

        const associatedRole = user ? user.role : subUser.role;

        if (associatedRole !== role) {
            return res.status(403).json({
                message: `Un Authorized role, (Inconsistency): ${associatedRole}`,
            })
        }

        const inspection = await inspectionModel.findById(inspectionId);
        if (!inspection) {
            return res.status(403).json({ message: 'Inspection not found' });
        }

        const roomCount = inspection.rooms.length;

        if (associatedRole === 'FREETIER')
        {
            if (roomCount >= 5)
            {
                return res.status(403).json({
                    message: "You have reached your room limit as a Free Tier User!",
                });
            }
        }
        else if (associatedRole === 'STANDARDTIER')
        {
            if (roomCount >= 10)
            {
                return res.status(403).json({
                    message: "You have reached your room limit as a Standard Tier User!",
                });
            }
        }
        else if (associatedRole !== 'TOPTIER')
        {
            return res.status(403).json({
                message: `Un Authorized role: ${associatedRole}`,
            })
        }

        next();
    }   
    catch(err)
    {
        console.log(err);
        return res.status(403).json({ message: 'Authorization Failed', error: err.message });
    }
}

export const inspectionElementLimitAuthorization = async (req, res, next) => {
    try
    {
        const { _id, role } = req.user;
        const {inspectionId, roomId} = req.body;

        const user = await userModel.findById(_id);
        const subUser = await subUserModel.findById(_id);

        if (!user && !subUser) {
            return res.status(403).json({ message: 'User not found' });
        }

        const associatedRole = user ? user.role : subUser.role;

        if (associatedRole !== role) {
            return res.status(403).json({
                message: `Un Authorized role, (Inconsistency): ${associatedRole}`,    
            })
        }

        const inspection = await inspectionModel.findById(inspectionId);
        if (!inspection) {
            return res.status(403).json({ message: 'Inspection not found' });
        }

        const room = inspection.rooms.id(roomId);
        if (!room) {
            return res.status(403).json({ message: 'Room not found' });    
        }

        if (associatedRole === 'FREETIER')
        {
            if (room.elements.length >= 5)
            {
                return res.status(403).json({
                    message: "You have reached your element limit as a Free Tier User!",
                });
            }
        }
        else if (associatedRole === 'STANDARDTIER')
        {
            if (room.elements.length >= 10)
            {
                return res.status(403).json({
                    message: "You have reached your element limit as a Standard Tier User!",
                });
            }
        }
        else if (associatedRole !== 'TOPTIER')
        {
            return res.status(403).json({
                message: `Un Authorized role: ${associatedRole}`,
            })
        }

        next();
    }
    catch(err)
    {
        console.log(err);
        return res.status(403).json({ message: 'Authorization Failed', error: err.message });
    }
}

export const templateNotDefaultCheck = async (req, res, next) => {
    try
    {
        let templateId = req.params.id;

        if (!templateId) {
            templateId = req.body.templateId;
        }

        const template = await inspectionTemplateModel.findById(templateId);
        if (!template) {
            return res.status(403).json({ message: 'Template not found' });
        }

        if (template.isDefault == true) {
            return res.status(403).json({
                message: "Default Template Manipulation is not allowed!",
            });
        }

        next();
    }
    catch(err)
    {
        console.log(err);
        return res.status(403).json({ message: 'Authorization Failed while Checking Template', error: err.message });
    }

}

export const paymentAuthorization = async (req, res, next) => {
    try
    {
        const { _id, role } = req.user;

        const user = await userModel.findById(_id);
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }

        const associatedRole = user.role;

        if (associatedRole !== role) {
            return res.status(403).json({
                message: `Un Authorized role, (Inconsistency): ${associatedRole}`,
            })
        }

        if (associatedRole !== 'STANDARDTIER' && associatedRole !== 'TOPTIER' && associatedRole !== 'FREETIER') {
            return res.status(403).json({
                message: `You are not authorized to perform this action with role: ${associatedRole}`,
            })
        }

        next();

    }
    catch(err)
    {
        console.log(err);
        return res.status(403).json({ message: 'Authorization Failed', error: err.message });
    }
};