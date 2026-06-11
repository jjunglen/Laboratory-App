require("dotenv").config();
const { Resend } = require("resend");

// Create a Resend instance using our API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Sends an email to a user when their alert matches
// an item in the inventory
const sendAlertEmail = async ({ to, shoe_name, size, condition, boxCondition, price, shopify_url }) => {
  try {
        const { data, error } = await resend.emails.send({
        from:    `The Laboratory DTX <${process.env.RESEND_FROM_EMAIL}>`,
        to:      [to],
        subject: `Your shoe is in — ${shoe_name} size ${size}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 32px; border-radius: 12px;">
            <h1 style="color: #378ADD; font-size: 24px; margin-bottom: 8px;">Your shoe is in.</h1>
            <p style="color: #888; margin-bottom: 24px;">An item matching your alert just hit The Laboratory DTX inventory.</p>

            <div style="background: #111; border: 1px solid #1e1e1e; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px;"><strong>Shoe:</strong> ${shoe_name}</p>
                <p style="margin: 0 0 8px;"><strong>Size:</strong> ${size}</p>
                <p style="margin: 0 0 8px;"><strong>Condition:</strong> ${condition === "brand_new" ? "Brand New" : "Pre-Owned"}</p>
                <p style="margin: 0 0 8px;"><strong>Box:</strong> ${boxCondition}</p>
                <p style="margin: 0;"><strong>Price:</strong> $${price}</p>
            </div>

            <a href="${shopify_url}" style="display: inline-block; background: #378ADD; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                View and buy →
            </a>

            <p style="color: #444; font-size: 12px; margin-top: 24px;">
                You're receiving this because you set an alert on The Laboratory DTX app.
            </p>
            </div>
        `,
    });

    if (error) {
      console.error("Resend email error:", error);
      return false;
    }

    console.log("Email sent successfully:", data.id);
    return true;

  } catch (error) {
    console.error("Send alert email error:", error.message);
    return false;
  }
};

module.exports = { sendAlertEmail };
