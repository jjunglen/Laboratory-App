const jwt = require("jsonwebtoken");
const { User } = require("../models/index.js");

const googleCallback = async (req, res) => {
    try {
        const { id, emails, displayName, photos } = req.user;
        const email = emails[0].value;
        const avatarUrl = photos?.[0]?.value || null;

        // Find or create user
        let [user, created] = await User.findOrCreate({
          where: { email },
          defaults: {
            full_name: displayName,
            email,
            avatar_url: avatarUrl,
            auth_id: id,
            role: "user",
            notify_email: true,
            notify_inapp: true,
            email_verified: true,

          },
        });

        // Update avatar if changed
        if (!created && !user.avatar_url) {
            await user.update({ auth_id: id, avatar_url: avatarUrl });
        }

        const jwt = require("jsonwebtoken");
        // Generate JWT
        const jwtToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
        );

        // Check if user needs onboarding
        const needsOnboarding = !user.sizes || user.sizes.length === 0;
        const destination = needsOnboarding ? "onboarding/size" : "dashboard?verified=true";

        return res.redirect(
            `${process.env.FRONTEND_URL}/auth?token=${jwtToken}&next=${destination}`,
        );

    } catch (error) {
        console.error("Google callback error:", error.message);
        return res.redirect(`${process.env.FRONTEND_URL}/auth?error=google_failed`);
    }
};

module.exports = { googleCallback };
