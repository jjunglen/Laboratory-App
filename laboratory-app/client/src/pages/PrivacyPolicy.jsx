import Navbar from "../components/layout/Navbar";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-zinc-500 text-sm mb-10">Last updated: August 2026</p>

        <div className="space-y-8 text-zinc-300 text-sm md:text-base leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Who We Are</h2>
            <p>Lab Sync is a sneaker inventory alert service operated by The Laboratory DTX, located in Dallas, TX. We help customers get notified when shoes they want become available in their size.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Information We Collect</h2>
            <ul className="space-y-2 list-disc list-inside text-zinc-400">
              <li><span className="text-zinc-300">Account information</span> — your name, email address, and password when you register.</li>
              <li><span className="text-zinc-300">Shoe preferences</span> — shoe sizes and alert preferences you set in your profile.</li>
              <li><span className="text-zinc-300">Usage data</span> — pages visited, notifications clicked, and purchases made through Lab Sync.</li>
              <li><span className="text-zinc-300">Device information</span> — browser type, device type, and push notification subscription data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <ul className="space-y-2 list-disc list-inside text-zinc-400">
              <li>To send you email, in-app, and push notifications when shoes you're tracking become available.</li>
              <li>To personalize your browsing experience and show inventory in your sizes.</li>
              <li>To track which notifications led to purchases, for internal analytics.</li>
              <li>To improve the Lab Sync platform and fix issues.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Notifications</h2>
            <p className="text-zinc-400">We send notifications only for shoes you've explicitly set alerts for. You can disable email, in-app, or push notifications at any time from your Profile page. You can also delete your alerts at any time.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Data Sharing</h2>
            <p className="text-zinc-400">We do not sell your personal data to third parties. We share data only with:</p>
            <ul className="space-y-2 list-disc list-inside text-zinc-400 mt-2">
              <li><span className="text-zinc-300">Resend</span> — our email delivery provider.</li>
              <li><span className="text-zinc-300">Supabase</span> — our database and authentication provider.</li>
              <li><span className="text-zinc-300">Shopify</span> — to process purchases on thelabdtx.com.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Data Retention</h2>
            <p className="text-zinc-400">We retain your account data as long as your account is active. You may request deletion of your account and all associated data at any time by emailing us.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Security</h2>
            <p className="text-zinc-400">We use industry-standard encryption and security practices to protect your data. Passwords are hashed using bcrypt and never stored in plain text.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Your Rights</h2>
            <p className="text-zinc-400">You may request access to, correction of, or deletion of your personal data at any time by contacting us at the email below.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Contact</h2>
            <p className="text-zinc-400">For privacy questions, contact us at <a href="mailto:j.junglen@gmail.com" className="text-blue-400 hover:underline">j.junglen@gmail.com</a></p>
          </section>

        </div>
      </div>
    </div>
  );
}