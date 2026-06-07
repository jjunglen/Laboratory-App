const { User, Preference } = require("../models/index.js");
const { isValidEmail } = require("../utils/validate.js");
const { success, badRequest, notFound, serverError} = require("../utils/response.js");

// GET PROFILE
// GET /api/users/profile
// Returns the logged in user's profile and preferences
const getProfile = async (req, res) => {
    try {
        // find the user and include their Preferences
        const user = await User.findByPk(req.user.id, {
            include: [{model: Preference }],
            attributes: {exclude: ["password"]},
        });

        if (!user) {
            return notFound(res, "User not found");
        }

        return success(res, user);
    } catch (error) {
        console.error("Get profile error:", error.message);
        return serverError(res);


    }
};

// UPDATE PROFILE
// PUT /api/users/profile
// Updates the logged in user's profile
const updateProfile = async (req, res) => {
    try {
        const { full_name, email, notify_email, notify_inapp } = req.body;

        // Find the user
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return notFound(res, "User not found.");

        }

        // Validate email if being changed
        if (email && email !== user.email) {
            if (!isValidEmail(email)) {
                return badRequest(res, "Invalid email address");
            }

            const existingUser = await User.findOne({where: {email}});
            if (existingUser) {
                return badRequest(res, "Email is already in use");

            }
        }

        // Update the user
        await user.update({
            full_name: full_name ?? user.full_name,
            email: email ?? user.email,
            notify_email: notify_email ?? user.notify_email,
            notify_inapp: notify_inapp ?? user.notify_inapp,
        
        });

        return success(res, {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            notify_email: user.notify_email,
            notify_inapp: user.notify_inapp,
        }, "Profile updated successfully!");

    } catch (error) {
        console.error("Update profile error:", error.message);
        return serverError(res);

    }
};

// DELETE ACCOUNT
// DELETE /api/users/profile
// delete the logged in user's account

const deleteAccount = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return notFound(res, "User not found");
        }

        // Deleting the user cascaders to all their alerts
        // preferences, notifications, and clicks automatically
        await user.destroy();

        return success(res, null, "Account successfully deleted");

    } catch (error) {
        console.error("Delete account error:", error.message);
        return serverError(res);

    }
};

module.exports = { getProfile, deleteAccount, updateProfile };