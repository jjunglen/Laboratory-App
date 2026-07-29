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
            role: "user",
            notify_email: true,
            notify_inapp: true,
        },
        });

        // Update avatar if changed
        if (!created && avatarUrl && user.avatar_url !== avatarUrl) {
        await user.update({ avatar_url: avatarUrl });
        }

        // Generate JWT
        const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
        );

        // Check if user needs onboarding
        const needsOnboarding = !user.sizes || user.sizes.length === 0;

        // Redirect to frontend with token
        const redirectUrl = needsOnboarding
        ? `${process.env.FRONTEND_URL}/onboarding/size?token=${token}`
        : `${process.env.FRONTEND_URL}/dashboard?token=${token}`;

        return res.redirect(redirectUrl);
    } catch (error) {
        console.error("Google callback error:", error.message);
        return res.redirect(`${process.env.FRONTEND_URL}/auth?error=google_failed`);
    }
};

module.exports = { googleCallback };
