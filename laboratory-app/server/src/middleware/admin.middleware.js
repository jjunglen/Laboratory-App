const { forbidden } = require("../utils/response.js");

// Check that the user logged in has admin privaleges
const requireAdmin = (req, res, next) => {
    try {
        // req.user is set by authenicationToken middleware
        if (!req.user) {
            return forbidden(res, "Access denied");
        }

        if (req.user.role !== "admin") {
            return forbidden(res, "Admin access required");
        }

        next();
    } catch (error) {
        return forbidden(res, "Authorization failed");
    }
};

module.exports = { requireAdmin };
