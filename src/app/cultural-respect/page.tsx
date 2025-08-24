import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function CulturalRespectPage() {
  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-mountain-stone">
            Cultural Respect & Authenticity
          </h1>
          <p className="text-lg text-soft-gray">
            Honoring 3,000 years of wisdom with reverence and authenticity
          </p>
        </div>

        <div className="space-y-8">
          {/* Our Approach */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">🏮</span>
                Our Cultural Approach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 leading-relaxed text-soft-gray">
                The I Ching (易經) is one of humanity&apos;s oldest
                philosophical texts, with roots dating back over 3,000 years. We
                approach this ancient wisdom with deep respect, cultural
                sensitivity, and a commitment to authenticity.
              </p>
              <p className="leading-relaxed text-soft-gray">
                Our goal is not to replace traditional I Ching study, but to
                make this profound wisdom more accessible to modern seekers
                while preserving its essential meaning and cultural context.
              </p>
            </CardContent>
          </Card>

          {/* Advisory Board */}
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">👥</span>
                Cultural Advisory Board
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium text-mountain-stone">
                    I Ching Scholars
                  </h3>
                  <p className="text-sm text-soft-gray">
                    We work with recognized scholars of Chinese philosophy and I
                    Ching interpretation to ensure accuracy and cultural
                    authenticity in our AI-generated content.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-medium text-mountain-stone">
                    Cultural Consultants
                  </h3>
                  <p className="text-sm text-soft-gray">
                    Chinese cultural experts review our content to prevent
                    misrepresentation and ensure we honor the traditions from
                    which the I Ching emerged.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Principles */}
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">⚖️</span>
                Our Guiding Principles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 font-medium text-mountain-stone">
                    1. Authenticity Over Innovation
                  </h3>
                  <p className="text-sm text-soft-gray">
                    While we use modern AI technology, our interpretations are
                    grounded in traditional I Ching principles and established
                    scholarly translations.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-medium text-mountain-stone">
                    2. Education, Not Appropriation
                  </h3>
                  <p className="text-sm text-soft-gray">
                    We provide educational context about the I Ching&apos;s
                    origins, development, and place in Chinese culture,
                    encouraging users to understand its broader significance.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-medium text-mountain-stone">
                    3. Transparent Sources
                  </h3>
                  <p className="text-sm text-soft-gray">
                    We cite our sources and acknowledge the scholarly works that
                    inform our interpretations, particularly the Wilhelm-Baynes
                    translation and other respected I Ching texts.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-medium text-mountain-stone">
                    4. Continuous Learning
                  </h3>
                  <p className="text-sm text-soft-gray">
                    We continuously refine our approach based on feedback from
                    cultural experts and the broader community of I Ching
                    practitioners.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What We Don't Do */}
          <Card variant="default" className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <span className="text-xl">🚫</span>
                What We Avoid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-red-700">
                <li>
                  • We do not claim to replace traditional I Ching study or
                  masters
                </li>
                <li>• We do not commercialize or trivialize sacred wisdom</li>
                <li>• We do not ignore the cultural context of the I Ching</li>
                <li>
                  • We do not present our AI interpretations as the only
                  &ldquo;correct&rdquo; reading
                </li>
                <li>
                  • We do not use cultural symbols or concepts without proper
                  understanding
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Traditional Foundations */}
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">📜</span>
                Traditional Foundations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium text-mountain-stone">
                    Classical Sources
                  </h3>
                  <ul className="space-y-1 text-sm text-soft-gray">
                    <li>• Original I Ching text (易經)</li>
                    <li>• Commentaries by Confucius (十翼)</li>
                    <li>• Wilhelm-Baynes translation</li>
                    <li>• Traditional hexagram interpretations</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-medium text-mountain-stone">
                    Modern Scholarship
                  </h3>
                  <ul className="space-y-1 text-sm text-soft-gray">
                    <li>• Contemporary I Ching research</li>
                    <li>• Cross-cultural philosophy studies</li>
                    <li>• Historical and archaeological context</li>
                    <li>• Comparative wisdom traditions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Responsibility */}
          <Card variant="default" className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <span className="text-xl">🤝</span>
                Shared Responsibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-blue-700">
                We invite our users to approach the I Ching with the same
                respect we strive to maintain. This ancient wisdom deserves
                thoughtful consideration, not casual entertainment. We encourage
                users to learn about the cultural context and to engage with the
                I Ching as a tool for genuine self-reflection and growth.
              </p>
            </CardContent>
          </Card>

          {/* Feedback */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">💬</span>
                Your Voice Matters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 leading-relaxed text-soft-gray">
                If you have concerns about our cultural representation or
                suggestions for improvement, we want to hear from you. Cultural
                respect is an ongoing practice, not a destination.
              </p>
              <p className="text-sm text-soft-gray">
                Contact us at{' '}
                <a
                  href="mailto:cultural@sage-wisdom.app"
                  className="text-flowing-water hover:text-mountain-stone"
                >
                  cultural@sage-wisdom.app
                </a>{' '}
                with your feedback.
              </p>
            </CardContent>
          </Card>

          {/* Acknowledgment */}
          <div className="border-t border-gentle-silver/20 pt-8 text-center">
            <p className="text-sm italic text-soft-gray">
              &ldquo;The I Ching does not offer itself with proofs and results;
              it does not vaunt itself, nor is it easy to approach. Like a part
              of nature, it waits until it is discovered.&rdquo;
            </p>
            <p className="mt-2 text-xs text-soft-gray">
              — Carl Jung, foreword to the Wilhelm-Baynes translation
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
