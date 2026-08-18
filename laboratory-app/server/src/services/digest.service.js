const { Op } = require("sequelize");
const { PendingNotification, User } = require("../models/index.js");
const { sendDigestEmail } = require("./email.service.js");

const flushPendingNotifications = async () => {
  const pending = await PendingNotification.findAll({ where: { sent: false } });
  if (pending.length === 0) return;

  const byUser = new Map();
  for (const p of pending) {
    if (!byUser.has(p.user_id)) byUser.set(p.user_id, []);
    byUser.get(p.user_id).push(p);
  }

  for (const [userId, items] of byUser) {
    const user = await User.findByPk(userId);
    if (!user) continue;

    await sendDigestEmail({ user, items });

    await PendingNotification.update(
      { sent: true },
      { where: { id: { [Op.in]: items.map((i) => i.id) } } },
    );
  }
};

module.exports = { flushPendingNotifications };
