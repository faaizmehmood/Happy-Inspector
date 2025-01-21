import questionTemplateModel from "../models/questionTemplateModel.js";
import subUserModel from "../models/subUserModel.js";

// Create Default Question Template
export const createDefaultQuestionTemplate = async (req, res) => {
    const { text, type, options, answer } = req.body;

    try {
        const newQuestionTemplate = await questionTemplateModel.create({
            isdefault: true,
            text,
            options,
            type,
            answer,
        });

        return res.status(201).send({
            message: "Question template created successfully!",
            questionTemplate: newQuestionTemplate,
        });
    } catch (err) {
        return res.status(400).send({
            message: "Failed to create question template!",
            error: err.message,
        });
    }
};

// Create Custom Question Template
export const createCustomQuestionTemplate = async (req, res) => {
    const { text, type, options, answer } = req.body;
    const { _id, role } = req.user;

    try {
        var newQuestionTemplate;

        if (role === "SUBUSER")
        {

            newQuestionTemplate = await questionTemplateModel.create({
                subUser: _id,
                isdefault: false,
                text,
                type,
                options,
                answer,
            });
        }
        else
        {
            newQuestionTemplate = await questionTemplateModel.create({
                user: _id,
                isdefault: false,
                text,
                type,
                options,
                answer,
            });
        }


        return res.status(201).send({
            message: "Question template created successfully!",
            questionTemplate: newQuestionTemplate,
        });
    } catch (err) {
        return res.status(400).send({
            message: "Failed to create question template!",
            error: err.message,
        });
    }
};

export const QuestionCreation = async ( _id, role, text, type, options, answerRequired) => 
{
    try {

        var newQuestionTemplate;
        if (role === "SUBUSER")
        {
            const subuser = await subUserModel.findById(_id);
            newQuestionTemplate = await questionTemplateModel.create({
                user: subuser.manager,
                subUser: _id,
                isdefault: false,
                text,
                type,
                options: options.map((option) => ({
                    option: option.option,
                    iconId: option.iconId,
                })),
                answer: "",
                answerRequired,
            });
        }
        else
        {
            newQuestionTemplate = await questionTemplateModel.create({
                user: _id,
                isdefault: false,
                text,
                type,
                options: options.map((option) => ({
                    option: option.option,
                    iconId: option.iconId,
                })),
                answer: "",
                answerRequired,
            });

        }

        return newQuestionTemplate;
    } catch (err) {
        throw err;
    }
}

export const GetQuestions = async ( _id, role ) => 
{
    let questions = [];
    var userQuestions;
    try {
        
        const defaultQuestions = await questionTemplateModel.find({ isdefault: true });
        if (role === "SUBUSER")
        {
            const subUser = await subUserModel.findById(_id);
            userQuestions = await questionTemplateModel.find({ user: subUser.manager, subUser: { $exists: false } });

            const subUserQuestions = await questionTemplateModel.find({  user: subUser.manager, subUser: _id });

            userQuestions = userQuestions.concat(subUserQuestions);
        }
        else
        {
            userQuestions = await questionTemplateModel.find({ user: _id });
        }

        questions = defaultQuestions.concat(userQuestions);
        return questions;
    }
    catch (err) {
        throw err;
    }
}

// Delete Question Template based on _id
export const deleteQuestionTemplate = async (req, res) => {
    try
    {
        const { _id, role } = req.user;
        const questionTemplateId = req.params.id;

        const questionTemplate = await questionTemplateModel.findById(questionTemplateId);
        if (!questionTemplate) {
            return res.status(400).send({
                message: "Saved Question not found!",
            });
        }

        if (questionTemplate.user.toString() !== _id) {
            return res.status(403).send({
                message: "You are not authorized to delete this question!",
            });
        }

        await questionTemplate.deleteOne({ _id: questionTemplateId });

        return res.status(200).send({
            message: "Saved question deleted successfully!",
        })


    }
    catch(err)
    {
        console.log(err);
        return res.status(400).send({
            message: "Failed to delete saved question!",
            error: err.message,
        });
    }
};
    
