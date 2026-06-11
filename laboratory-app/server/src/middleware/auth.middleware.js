const { verifyToken } = require("../utils/jwt.js");
const { unauthorized } = require("../utils/response.js");
const { User } = require("../models/index.js");

// Protezts private routes by verifying the JWT token
const authenticateToken = async (req, res, next) => {
    try {
        // get the authorization header
        const authHeader = req.headers.authorization;

        // validation
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return unauthorized(res, "No token provided");

        }

        // Pull the token from the header
        const token = authHeader.split(" ")[1];
        
        // Verify the token and decode
        const decoded = verifyToken(token);

        // validation
        if (!decoded) {
            return unauthorized(res, "Invalid or expired token");

        }

        // Find user from the database using the id from the token
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return unauthorized(res, "User no longer exists");
        }

        // Attach the user to the request so controllers can access it
        req.user = user;

        next();
    } catch (error) {
        return unauthorized(res, "Authentication failed");
    }
};

module.exports = { authenticateToken };

