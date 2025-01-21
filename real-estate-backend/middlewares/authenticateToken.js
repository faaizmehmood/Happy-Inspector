import jwt from 'jsonwebtoken';

// Middleware to authenticate access tokens
export const authenticateToken = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};