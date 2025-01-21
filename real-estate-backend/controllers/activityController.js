import userActivityModel from "../models/userActivityModel.js";

export const getUnReadActivities = async (req, res) => {
    try
    {
        const { page = 1, limit = 5 } = req.query; 
        const { _id, role } = req.user;
        
        let activities = [];

        if (role === "SUBUSER")
        {
            activities = await userActivityModel.find({ subUser: _id, subUserRead: false }).skip((page - 1) * limit).limit(limit);
        }
        else
        {
            activities = await userActivityModel.find({ user: _id, userRead: false }).skip((page - 1) * limit).limit(limit);
        }

        return res.status(200).json({ activities });

    }
    catch(err)
    {
        console.log(err);
        return res.status(403).json({ message: 'Failed to fetch Unread Activities', error: err.message });
    }
};

export const markAsReadActivity = async (req, res) => {
    try
    {
        const { _id, role } = req.user;
        const { activityId } = req.body;

        if (role === "SUBUSER")
        {
            await userActivityModel.updateOne({ _id: activityId }, { subUserRead: true });
        }
        else
        {
            await userActivityModel.updateOne({ _id: activityId }, { userRead: true });
        }

        return res.status(200).json({ message: "Activity marked as read successfully!" });
    }
    catch(err)
    {
        console.log(err);
        return res.status(403).json({ message: 'Failed to mark activity as read', error: err.message });
    }
};