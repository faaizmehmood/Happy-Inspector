import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const createTokensForUser = (user, deviceType) => {
    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role,
    };

    var accessToken = '';

    if (deviceType === 'web') 
    {
        accessToken = JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3d' });
    }
    else
    {
        accessToken = JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    }
    
    return { accessToken };
};