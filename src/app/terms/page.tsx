import Layout from '@/components/layout/Layout';

export default function TermsOfServicePage() {
  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold text-mountain-stone">
          Terms of Service
        </h1>

        <div className="space-y-8 text-soft-gray">
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-mountain-stone">
              Welcome to Sage
            </h2>
            <p className="leading-relaxed">
              These Terms of Service govern your use of Sage, an AI-enhanced I
              Ching consultation platform. By using our service, you agree to
              these terms and our commitment to providing respectful, authentic
              spiritual guidance.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-mountain-stone">
              Nature of Our Service
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-medium text-mountain-stone">
                  Spiritual Guidance, Not Medical Advice
                </h3>
                <p className="leading-relaxed">
                  Sage provides spiritual guidance and philosophical insights
                  based on the ancient wisdom of the I Ching. Our
                  interpretations are for personal reflection and spiritual
                  growth. We do not provide medical, legal, or professional
                  advice.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-medium text-mountain-stone">
                  AI-Enhanced Traditional Wisdom
                </h3>
                <p className="leading-relaxed">
                  Our AI technology enhances traditional I Ching interpretations
                  while respecting cultural authenticity. All interpretations
                  are generated based on established I Ching principles and
                  reviewed for cultural accuracy.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-mountain-stone">
              Your Responsibilities
            </h2>
            <ul className="list-inside list-disc space-y-2">
              <li>Use the service respectfully and in good faith</li>
              <li>
                Do not attempt to reverse-engineer or misuse our AI technology
              </li>
              <li>Respect the cultural traditions underlying the I Ching</li>
              <li>Keep your account credentials secure</li>
              <li>Use insights for personal growth, not to harm others</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-mountain-stone">
              Cultural Respect and Authenticity
            </h2>
            <p className="leading-relaxed">
              We are committed to honoring the 3,000-year tradition of the I
              Ching. Our service is developed with input from cultural
              consultants and scholars. We ask all users to approach the I Ching
              with respect and open-mindedness.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-mountain-stone">
              Service Availability
            </h2>
            <p className="leading-relaxed">
              We strive to provide reliable service but cannot guarantee 100%
              uptime. We may occasionally update or modify features to improve
              your experience or maintain cultural authenticity.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-mountain-stone">
              Intellectual Property
            </h2>
            <div className="space-y-4">
              <p className="leading-relaxed">
                The I Ching itself is ancient wisdom belonging to humanity. Our
                specific AI interpretations, interface, and technology are
                proprietary. Your personal consultation data remains yours.
              </p>
              <p className="leading-relaxed">
                Traditional I Ching texts and interpretations we reference are
                in the public domain. We provide proper attribution to scholars
                and translators whose work informs our service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-mountain-stone">
              Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              Sage provides spiritual guidance for personal reflection. We are
              not liable for decisions you make based on consultations. The I
              Ching tradition emphasizes personal responsibility and wisdom in
              applying its teachings.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-mountain-stone">
              Account Termination
            </h2>
            <p className="leading-relaxed">
              You may delete your account at any time. We may suspend accounts
              that violate these terms or disrespect the cultural traditions we
              aim to honor. We will provide notice and opportunity to correct
              issues when possible.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-mountain-stone">
              Changes to Terms
            </h2>
            <p className="leading-relaxed">
              We may update these terms to reflect service improvements or legal
              requirements. Significant changes will be communicated through
              email and our service. Continued use indicates acceptance of
              updated terms.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-mountain-stone">
              Contact Us
            </h2>
            <p className="leading-relaxed">
              For questions about these terms, please contact us at{' '}
              <a
                href="mailto:support@sage-wisdom.app"
                className="text-flowing-water hover:text-mountain-stone"
              >
                support@sage-wisdom.app
              </a>
              .
            </p>
          </section>

          <section className="border-t border-gentle-silver/20 pt-8 text-sm text-soft-gray">
            <p>Last updated: December 2024</p>
            <p className="mt-2">
              These terms are governed by the principles of respectful cultural
              exchange and the ancient wisdom of the I Ching.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
