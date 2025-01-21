import Joi from 'joi';

// Validate user input data using joi schema for signupå
export const createSignupOTP = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
    });
    return schema.validate(data);
}

export const createUserAccountValidation = (data) => {
    const schema = Joi.object({
        fullname: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).required(),
        phoneNumber: Joi.string().min(10).max(15).optional(),
        businessName: Joi.string().optional(),
        userEnteredOTP: Joi.string().min(4).required(),
        signupType: Joi.string().valid('google', 'facebook', 'normal').required()
    });

    return schema.validate(data);
}

// --------------------------------------------------------

// Validate user input data using joi schema for login
export const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).required(),
        deviceType: Joi.string().valid('web', 'mobile').required(),
    });

    return schema.validate(data);
}

// --------------------------------------------------------

// Validate user input data using joi schema for account recovery
export const forgotPasswordValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
    });
    return schema.validate(data);
}

export const verfiyPasswordResetOTPValidation = (data) => {

    const schema = Joi.object({
        userEnteredOTP: Joi.string().min(4).required(),
    });

    return schema.validate(data);
}

export const resetPasswordValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        newPassword: Joi.string().min(4).required(),
    });

    return schema.validate(data);
}

// --------------------------------------------------------
