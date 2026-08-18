require("dotenv").config();
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendAlertEmail = async ({
  to,
  shoe_name,
  size,
  condition,
  boxCondition,
  price,
  shopify_url,
  image_url,
}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `The Laboratory DTX <${process.env.RESEND_FROM_EMAIL}>`,
      to: [to],
      subject: `Your shoe is in — ${shoe_name} size ${size}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 32px; border-radius: 12px;">
          <h1 style="color: #378ADD; font-size: 24px; margin-bottom: 8px;">Your shoe is in.</h1>
          <p style="color: #888; margin-bottom: 24px;">An item matching your alert just hit The Laboratory DTX inventory.</p>

          ${
            image_url
              ? `
          <div style="background: #ffffff; border-radius: 10px; padding: 16px; margin-bottom: 24px; text-align: center;">
            <img src="${image_url}" alt="${shoe_name}" style="max-width: 300px; height: auto; object-fit: contain;" />
          </div>
          `
              : ""
          }

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

const sendPriceDropEmail = async ({
  to,
  shoe_name,
  size,
  new_price,
  old_price,
  shopify_url,
  image_url,
}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `The Laboratory DTX <${process.env.RESEND_FROM_EMAIL}>`,
      to: [to],
      subject: `Price drop on ${shoe_name} size ${size}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 32px; border-radius: 12px;">
          <h1 style="color: #22c55e; font-size: 24px; margin-bottom: 8px;">Price Drop! 🏷️</h1>
          <p style="color: #888; margin-bottom: 24px;">A shoe you're tracking just dropped in price at The Laboratory DTX.</p>

          ${
            image_url
              ? `
          <div style="background: #ffffff; border-radius: 10px; padding: 16px; margin-bottom: 24px; text-align: center;">
            <img src="${image_url}" alt="${shoe_name}" style="max-width: 300px; height: auto; object-fit: contain;" />
          </div>
          `
              : ""
          }

          <div style="background: #111; border: 1px solid #1e1e1e; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px;"><strong>Shoe:</strong> ${shoe_name}</p>
            <p style="margin: 0 0 8px;"><strong>Size:</strong> ${size}</p>
            <p style="margin: 0 0 8px;"><strong>New Price:</strong> <span style="color: #22c55e; font-size: 18px; font-weight: bold;">$${new_price}</span></p>
            <p style="margin: 0;"><strong>Was:</strong> <span style="color: #888; text-decoration: line-through;">$${old_price}</span></p>
          </div>

          <a href="${shopify_url}" style="display: inline-block; background: #22c55e; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Buy now →
          </a>

          <p style="color: #444; font-size: 12px; margin-top: 24px;">
            You're receiving this because you set an alert on The Laboratory DTX app.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend price drop email error:", error);
      return false;
    }

    console.log("Price drop email sent:", data.id);
    return true;
  } catch (error) {
    console.error("Send price drop email error:", error.message);
    return false;
  }
};

const sendVerificationEmail = async ({ to, full_name, verification_url }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `The Laboratory DTX <${process.env.RESEND_FROM_EMAIL}>`,
      to: [to],
      subject: `Verify your Lab Sync email`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 32px; border-radius: 12px;">
          <h1 style="color: #3b82f6; font-size: 24px; margin-bottom: 8px;">Verify your email</h1>
          <p style="color: #888; margin-bottom: 24px;">Hey ${full_name || "there"}, confirm your email to start getting sneaker alerts from The Laboratory DTX.</p>
          <a href="${verification_url}" style="display: inline-block; background: #3b82f6; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-bottom: 24px;">
            Verify my email →
          </a>
          <p style="color: #444; font-size: 12px; margin-top: 24px;">
            If you didn't sign up for Lab Sync, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Verification email error:", error);
      return false;
    }

    console.log("Verification email sent:", data.id);
    return true;
  } catch (error) {
    console.error("Send verification email error:", error.message);
    return false;
  }
};

const sendDigestEmail = async ({ user, items }) => {
  try {
    const itemsHtml = items
      .map(
        (item) => `
      <div style="background: #111; border: 1px solid #1e1e1e; border-radius: 10px; padding: 20px; margin-bottom: 16px;">
        ${
          item.image_url
            ? `
        <div style="background: #ffffff; border-radius: 8px; padding: 12px; margin-bottom: 16px; text-align: center;">
          <img src="${item.image_url}" alt="${item.shoe_name}" style="max-width: 220px; height: auto; object-fit: contain;" />
        </div>
        `
            : ""
        }
        <p style="margin: 0 0 4px; font-weight: bold; font-size: 16px;">${item.shoe_name}</p>
        <p style="margin: 0 0 16px; color: #888; font-size: 14px;">Size ${item.size} — $${item.price}</p>
        <a href="${item.shopify_url}" style="display: inline-block; background: #378ADD; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
          View →
        </a>
      </div>
    `,
      )
      .join("");

    const { data, error } = await resend.emails.send({
      from: `The Laboratory DTX <${process.env.RESEND_FROM_EMAIL}>`,
      to: [user.email],
      subject: `${items.length} new match${items.length > 1 ? "es" : ""} at The Laboratory DTX`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 32px; border-radius: 12px;">
          <h1 style="color: #378ADD; font-size: 24px; margin-bottom: 8px;">Your shoes are in.</h1>
          <p style="color: #888; margin-bottom: 24px;">
            Hey${user.full_name ? ` ${user.full_name}` : ""}, ${items.length} item${items.length > 1 ? "s" : ""} matching your alerts just hit The Laboratory DTX.
          </p>

          ${itemsHtml}

          <p style="color: #444; font-size: 12px; margin-top: 24px;">
            You're receiving this because you set an alert on The Laboratory DTX app.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend digest email error:", error);
      return false;
    }

    console.log("Digest email sent:", data.id);
    return true;
  } catch (error) {
    console.error("Send digest email error:", error.message);
    return false;
  }
};

module.exports = {
  sendAlertEmail,
  sendPriceDropEmail,
  sendVerificationEmail,
  sendDigestEmail,
};
