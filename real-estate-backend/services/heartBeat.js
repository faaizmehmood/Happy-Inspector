import subUserModel from "../models/subUserModel";

export const subUserHeartBeat = async (req, res) => {

    const { _id } = req.user;

    try {
        const subUser = await subUserModel.findById(_id);
        if (!subUser) {
            return res.status(400).send({
                message: "Sub User not found!",
            });
        }

        subUser.lastOnline = Date.now();
        await subUser.save();

        return res.status(200).send({
            message: "Sub User Heartbeat successful!",
        });
    } catch (err) {
        return res.status(500).send({
            message: "Internal server error",
        });
    }


}