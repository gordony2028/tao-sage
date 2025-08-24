import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function ContactUsPage() {
  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-mountain-stone">
            Contact Us
          </h1>
          <p className="text-lg text-soft-gray">
            We&apos;re here to help you on your journey of wisdom and
            self-discovery
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Form */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-mountain-stone">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-stone-gray/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-flowing-water"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-mountain-stone">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-stone-gray/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-flowing-water"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-mountain-stone">
                    Subject
                  </label>
                  <select className="w-full rounded-lg border border-stone-gray/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-flowing-water">
                    <option value="">Select a topic</option>
                    <option value="support">Technical Support</option>
                    <option value="cultural">Cultural Questions</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-mountain-stone">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full rounded-lg border border-stone-gray/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-flowing-water"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <Button className="w-full" size="lg">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card variant="default">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">📧</span>
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <strong>General Support:</strong>
                    <br />
                    <a
                      href="mailto:support@sage-wisdom.app"
                      className="text-flowing-water hover:text-mountain-stone"
                    >
                      support@sage-wisdom.app
                    </a>
                  </div>
                  <div>
                    <strong>Cultural Questions:</strong>
                    <br />
                    <a
                      href="mailto:cultural@sage-wisdom.app"
                      className="text-flowing-water hover:text-mountain-stone"
                    >
                      cultural@sage-wisdom.app
                    </a>
                  </div>
                  <div>
                    <strong>Privacy Concerns:</strong>
                    <br />
                    <a
                      href="mailto:privacy@sage-wisdom.app"
                      className="text-flowing-water hover:text-mountain-stone"
                    >
                      privacy@sage-wisdom.app
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="default">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">⏰</span>
                  Response Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Technical Support:</strong> 24-48 hours
                  </div>
                  <div>
                    <strong>Cultural Questions:</strong> 2-3 business days
                  </div>
                  <div>
                    <strong>General Inquiries:</strong> 1-2 business days
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="default">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">🏮</span>
                  Cultural Respect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-soft-gray">
                  We work with I Ching scholars and cultural consultants to
                  ensure authentic and respectful interpretations. If you have
                  concerns about cultural representation, we welcome your
                  feedback.
                </p>
              </CardContent>
            </Card>

            <Card variant="default" className="bg-gentle-silver/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  Quick Help
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-soft-gray">
                  Before contacting us, you might find answers in our:
                </p>
                <ul className="space-y-1 text-sm">
                  <li>
                    <a
                      href="/learn/faq"
                      className="text-flowing-water hover:text-mountain-stone"
                    >
                      • FAQ Section
                    </a>
                  </li>
                  <li>
                    <a
                      href="/learn/basics"
                      className="text-flowing-water hover:text-mountain-stone"
                    >
                      • I Ching Basics Guide
                    </a>
                  </li>
                  <li>
                    <a
                      href="/cultural-respect"
                      className="text-flowing-water hover:text-mountain-stone"
                    >
                      • Cultural Approach
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Community Note */}
        <div className="mt-12 text-center">
          <Card variant="elevated" className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center justify-center gap-3">
                <span className="text-2xl">🤝</span>
                <h3 className="text-lg font-medium text-blue-800">
                  Join Our Community
                </h3>
              </div>
              <p className="mb-4 text-sm text-blue-700">
                Connect with other seekers of wisdom and share your I Ching
                journey. We&apos;re building a respectful community focused on
                authentic spiritual growth.
              </p>
              <Button
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Coming Soon: Community Forum
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
