const bcrypt = require("bcrypt");
const supabase = require("../config/supabase.js");
const { User } = require("../models/index.js");
const { signToken } = require("../utils/jwt.js");
const { isValidEmail, isValidPassword, requireFields } = require("../utils/validate.js");
const { success, created, badRequest, unauthorized, serverError } = require("../utils/response.js");

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
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            sizes: user.sizes
        }}, "Account created successfully")

    } catch(error) {
        console.error("Register error: ", error.message);
        return serverError(res);
    }   
};

// LOGIN
// POST /api/auth/login

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        const missing = requireFields(req.body, ["email", "password"]);
        if (missing.length > 0) {
            return badRequest(res, `Missing fields: ${missing.join(", ")}`)
        };

        // See if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return unauthorized(res, "Invalid email or password");
        }

        // password match
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return unauthorized(res, "Invalid email or password");
        }

        const token = signToken(user);

        return success(res, { token, user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            sizes: user.sizes,
        }}, "Logging in successfully")

    } catch (error) {
        console.error("Login error:", error.message);
        return serverError(res);

    }
}

// GOOGLE AUTH
// POST /api/auth/google
const googleAuth = async (req, res) => {
    try {
        const { access_token } = req.body;

        if (!access_token) {
            return badRequest(res, "Missing Google access token");

        }

        // Verify google token with Supabase
        const { data, error } = await supabase.auth.getUser(access_token);
        if (error || !data.user) {
            return unauthorized(res, "Invalid Google token");
        }

        const { id: auth_id, email, user_metadata } = data.user;

        let user = await User.findOne({ where: {email}});
        if (!user) {
            // First time google login -create an account
            user = await User.create({
                auth_id,
                email,
                full_name: user_metadata.full_name || null,
                avatar_url: user_metadata.avatar_url || null,
            });
        } else {
            // Returning Google user = update their auth_id
            if (!user.auth_id) {
                await user.update({ auth_id });
            }
        }

        // Sign a jwt token
        const token = signToken(user);

        return success(res, { token, user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            avatar_url: user.avatar_url,
            sizes: user.sizes,
        }}, "Logged in with Google successfully");
    } catch (error) {
        console.error("Google auth error:", error.message);
        return serverError(res)
    }
};

// GET ME
// GET /api/auth/me
const getMe = async (req, res) => {
    try {
        // req.user is set by authenticateToken middleware
        const user = req.user;

        return success(res, {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            avatar_url: user.avatar_url,
            notify_email: user.notify_email,
            notify_inapp: user.notify_inapp,
            sizes: user.sizes
        });
    } catch (error) {
        console.error("Get me error:", error.message);
        return serverError(res);
    }
};

// LOGOUT
// POST /api/auth/logout
const logout = async (req, res) => {
    try {
        return success(res, null, "Logged out successfully");
    } catch(error) {
        console.error("Logout error:", error.message);
        return serverError(res);
    }
};

module.exports = { register, login, googleAuth, getMe, logout };

