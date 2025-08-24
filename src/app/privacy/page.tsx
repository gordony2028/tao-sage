import Layout from '@/components/layout/Layout';

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold text-mountain-stone">
          Privacy Policy
        </h1>

        <div className="space-y-8 text-soft-gray">
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-mountain-stone">
              Our Commitment to Privacy
            </h2>
            <p className="leading-relaxed">
              At Sage, we understand that your spiritual journey is deeply
              personal. We are committed to protecting your privacy and ensuring
              that your consultations, personal questions, and spiritual
              insights remain confidential and secure.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-mountain-stone">
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-medium text-mountain-stone">
                  Account Information
                </h3>
                <p className="leading-relaxed">
                  When you create an account, we collect your email address and
                  any optional profile information you choose to provide. We
                  never require more personal information than necessary.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-medium text-mountain-stone">
                  Consultation Data
                </h3>
                <p className="leading-relaxed">
                  Your I Ching consultations, questions, and our AI-generated
                  interpretations are stored securely to provide you with a
                  personal history. This data is encrypted and never shared with
                  third parties.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-medium text-mountain-stone">
                  Usage Analytics
                </h3>
                <p className="leading-relaxed">
                  We collect anonymous usage data to improve our service, such
                  as which features are used most often. This data cannot be
                  linked to your identity.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-mountain-stone">
              How We Use Your Information
            </h2>
            <ul className="list-inside list-disc space-y-2">
              <li>
                To provide personalized I Ching consultations and
                interpretations
              </li>
              <li>
                To maintain your consultation history and track your spiritual
                progress
              </li>
              <li>To send you daily guidance (only if you opt in)</li>
              <li>To improve our AI interpretations and user experience</li>
              <li>To communicate important service updates</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-mountain-stone">
              Data Security
            </h2>
            <p className="leading-relaxed">
              Your spiritual journey data is encrypted both in transit and at
              rest using industry-standard security measures. We regularly audit
              our security practices and work with security experts to ensure
              your information remains protected.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-mountain-stone">
              Your Rights
            </h2>
            <p className="leading-relaxed">
              You have complete control over your data. You can export your
              consultation history, delete your account and all associated data,
              or contact us with any privacy concerns. We believe your spiritual
              journey belongs to you.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-mountain-stone">
              Cultural Sensitivity
            </h2>
            <p className="leading-relaxed">
              We work with cultural consultants to ensure our AI interpretations
              respect the ancient traditions of the I Ching. We do not use your
              personal consultation data to train our AI models without explicit
              consent.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-mountain-stone">
              Contact Us
            </h2>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy or how we
              handle your data, please contact us at{' '}
              <a
                href="mailto:privacy@sage-wisdom.app"
                className="text-flowing-water hover:text-mountain-stone"
              >
                privacy@sage-wisdom.app
              </a>
              .
            </p>
          </section>

          <section className="border-t border-gentle-silver/20 pt-8 text-sm text-soft-gray">
            <p>Last updated: December 2024</p>
            <p className="mt-2">
              This policy may be updated periodically. We will notify users of
              significant changes via email and through our service.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
