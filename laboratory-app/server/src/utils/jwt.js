require("dotenv").config();
const jwt = require("jsonwebtoken");

// Creates a JWT token for a user after login
const signToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        }
    );
};

// Verification of the JWT Token and returns the decoded payload
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = { signToken, verifyToken };
