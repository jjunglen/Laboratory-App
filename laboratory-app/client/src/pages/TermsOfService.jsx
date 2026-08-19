import Navbar from "../components/layout/Navbar";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Terms of Service
        </h1>
        <p className="text-zinc-500 text-sm mb-10">Last updated: August 2026</p>

        <div className="space-y-8 text-zinc-300 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-zinc-400">
              By creating an account on Lab Sync, you agree to these Terms of
              Service. If you do not agree, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              2. What Lab Sync Does
            </h2>
            <p className="text-zinc-400">
              Lab Sync is a free notification service that alerts you when shoes
              you're tracking become available at The Laboratory DTX in Dallas,
              TX. We do not sell shoes directly — all purchases are completed on
              thelabdtx.com.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              3. Your Account
            </h2>
            <ul className="space-y-2 list-disc list-inside text-zinc-400">
              <li>
                You must provide accurate information when creating your
                account.
              </li>
              <li>You are responsible for keeping your password secure.</li>
              <li>You must be at least 13 years old to use Lab Sync.</li>
              <li>
                One account per person — duplicate accounts may be removed.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              4. Alerts and Notifications
            </h2>
            <ul className="space-y-2 list-disc list-inside text-zinc-400">
              <li>
                Alerts are best-effort — we cannot guarantee a shoe will still
                be available when you click a notification link.
              </li>
              <li>
                Inventory updates in real time and items can sell out before you
                complete a purchase.
              </li>
              <li>
                Lab Sync is not responsible for missed purchases due to delays
                in notification delivery.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              5. Purchases
            </h2>
            <p className="text-zinc-400">
              All purchases are made directly through The Laboratory DTX on
              thelabdtx.com. Lab Sync is not a party to any transaction. Any
              disputes about orders, returns, or refunds should be directed to
              The Laboratory DTX.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              6. Acceptable Use
            </h2>
            <p className="text-zinc-400">You agree not to:</p>
            <ul className="space-y-2 list-disc list-inside text-zinc-400 mt-2">
              <li>Use Lab Sync for any unlawful purpose.</li>
              <li>
                Attempt to scrape, reverse engineer, or abuse the platform.
              </li>
              <li>Create fake accounts or manipulate alert data.</li>
              <li>Interfere with the service or its infrastructure.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              7. Service Availability
            </h2>
            <p className="text-zinc-400">
              We strive to keep Lab Sync available at all times but do not
              guarantee uninterrupted service. We may update, suspend, or
              discontinue the service at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              8. Limitation of Liability
            </h2>
            <p className="text-zinc-400">
              Lab Sync is provided "as is" without warranty of any kind. We are
              not liable for any indirect, incidental, or consequential damages
              arising from your use of the service, including missed purchases
              or notification failures.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              9. Changes to Terms
            </h2>
            <p className="text-zinc-400">
              We may update these terms at any time. Continued use of Lab Sync
              after changes are posted constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              10. Contact
            </h2>
            <p className="text-zinc-400">
              For questions about these terms, contact us at{" "}
              <a
                href="mailto:j.junglen@gmail.com"
                className="text-blue-400 hover:underline"
              >
                j.junglen@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
