const bcrypt = require("bcrypt");
const supabase = require("../config/supabase.js");
const { User } = require("../models/index.js");
const { signToken } = require("../utils/jwt.js");
const { isValidEmail, isValidPassword, requireFields } = require("../utils/validate.js");
const { success, created, badRequest, unauthorized, serverError } = require("../utils/response.js");
const { sign } = require("jsonwebtoken");

// register
// POST /api/auth.register -- creates an account and email
const register = async (req, res) => {
    try {
        const { email, password, full_name } = req.body;

        // check if fields are present
        const missing = requireFields(req.body, ["email", "password"]);
        if (missing.length > 0) {
            return badRequest(res, `Missing fields: ${missing.join(", ")}`);
        }

        // Validate fields
        if (!isValidEmail(email)) {
            return badRequest(res, "Invalid email address");
        }

        if (!isValidPassword(password)) {
            return badRequest(res, "Password must be at least 8 characters and include a number and symbol");
        }

        // Check if user already registered
        const existingUser = await User.findOne({ where: { email }});
        if (existingUser) {
            return badRequest(res, "Email already registered");
        };

        // hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const user = await User.create({
            email,
            password: hashPassword,
            full_name: full_name || null,
        })

        // Sign a JWT token for the new user
        const token = signToken(user);

        return created(res, { token, user: {
            // FINISH
        }}, "Account created successfully")

    } catch(error) {

    }
}
