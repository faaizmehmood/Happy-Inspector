import subUserModel from "../models/subUserModel.js";
import userModel from "../models/userModel.js";

export const checkIfEmailExistsInUserAndSubUser = async (email) => {

    try
    {
        const user = await userModel.findOne({ email });
        const subUser = await subUserModel.findOne({ email });

        if (user || subUser)
        {
            return true;
        }
        else
        {
            return false;
        }

    }
    catch (error)
    {
        console.log(error);
        throw error;
    }

};