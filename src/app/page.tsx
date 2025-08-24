import Layout from '@/components/layout/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section - Modern Minimalist */}
      <section className="bg-gradient-to-b from-paper-white to-gentle-silver/20 px-4 py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-flowing-water/10 px-4 py-2 text-sm text-flowing-water">
            <span className="text-lg">道</span>
            Ancient Wisdom. Modern Clarity.
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight text-mountain-stone lg:text-6xl">
            AI-Powered I Ching
            <br />
            <span className="text-flowing-water">Life Guidance</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-soft-gray">
            Experience 3,000 years of wisdom enhanced by modern AI. Get
            personalized guidance for life&apos;s most important questions
            through authentic I Ching consultations.
          </p>

          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/guidance">
              <Button size="lg" className="min-w-48 px-8 py-4 text-lg">
                Start with Daily Guidance
              </Button>
            </Link>
            <Link href="/consultation">
              <Button
                variant="outline"
                size="lg"
                className="min-w-48 px-8 py-4 text-lg"
              >
                Ask a Question
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-soft-gray">
            <div className="flex items-center gap-2">
              <span className="text-lg">✓</span>
              Culturally Authentic
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">✓</span>
              Privacy Focused
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">✓</span>
              Scholar Reviewed
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Streamlined */}
      <section className="bg-cloud-white px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-mountain-stone lg:text-4xl">
              Your Path to Wisdom
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-soft-gray">
              Three simple ways to access ancient wisdom for modern life
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Daily Guidance */}
            <Card
              variant="elevated"
              className="group text-center transition-all duration-300 hover:shadow-xl"
            >
              <CardHeader className="pb-4">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sunset-gold to-earth-brown transition-transform group-hover:scale-110">
                  <span className="text-2xl text-cloud-white">導</span>
                </div>
                <CardTitle className="text-xl">Daily Guidance</CardTitle>
                <CardDescription className="text-base">
                  Start each day with personalized wisdom from the 64 hexagrams
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="mb-6 space-y-3 text-sm text-soft-gray">
                  <li className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-flowing-water"></span>
                    Daily hexagram insights
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-flowing-water"></span>
                    Practical life applications
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-flowing-water"></span>
                    Mindful reflection prompts
                  </li>
                </ul>
                <Link href="/guidance">
                  <Button variant="outline" className="w-full">
                    Get Today&apos;s Guidance
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Personal Consultations */}
            <Card
              variant="elevated"
              className="group text-center transition-all duration-300 hover:shadow-xl"
            >
              <CardHeader className="pb-4">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-flowing-water to-bamboo-green transition-transform group-hover:scale-110">
                  <span className="text-2xl text-cloud-white">卜</span>
                </div>
                <CardTitle className="text-xl">
                  Personal Consultations
                </CardTitle>
                <CardDescription className="text-base">
                  Ask your deepest questions and receive traditional I Ching
                  guidance
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="mb-6 space-y-3 text-sm text-soft-gray">
                  <li className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-flowing-water"></span>
                    Authentic coin casting method
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-flowing-water"></span>
                    AI-enhanced interpretations
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-flowing-water"></span>
                    Personal consultation archive
                  </li>
                </ul>
                <Link href="/consultation">
                  <Button variant="outline" className="w-full">
                    Ask a Question
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Consultation History */}
            <Card
              variant="elevated"
              className="group text-center transition-all duration-300 hover:shadow-xl"
            >
              <CardHeader className="pb-4">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-bamboo-green to-mountain-stone transition-transform group-hover:scale-110">
                  <span className="text-2xl text-cloud-white">史</span>
                </div>
                <CardTitle className="text-xl">Your Journey</CardTitle>
                <CardDescription className="text-base">
                  Track patterns and growth in your spiritual development
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="mb-6 space-y-3 text-sm text-soft-gray">
                  <li className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-flowing-water"></span>
                    Consultation timeline
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-flowing-water"></span>
                    Pattern recognition
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-flowing-water"></span>
                    Progress insights
                  </li>
                </ul>
                <Link href="/history">
                  <Button variant="outline" className="w-full">
                    View Your History
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cultural Respect Section - Simplified */}
      <section className="bg-cloud-white px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-12 lg:flex-row">
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-700">
                <span className="text-lg">🏮</span>
                Cultural Authenticity
              </div>
              <h2 className="mb-6 text-3xl font-bold text-mountain-stone">
                Built with Respect for Tradition
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-soft-gray">
                Our interpretations are guided by I Ching scholars and cultural
                consultants to honor the authentic teachings that have guided
                seekers for over 3,000 years.
              </p>
              <Link href="/cultural-respect">
                <Button variant="outline">Learn About Our Approach</Button>
              </Link>
            </div>
            <div className="flex-1">
              <Card
                variant="elevated"
                className="bg-gradient-to-br from-gentle-silver/20 to-flowing-water/10 p-8"
              >
                <div className="text-center">
                  <div className="mb-4 text-4xl">☯️</div>
                  <h3 className="mb-3 text-lg font-medium text-mountain-stone">
                    Traditional Foundation
                  </h3>
                  <ul className="space-y-2 text-sm text-soft-gray">
                    <li>✓ Wilhelm-Baynes Translation</li>
                    <li>✓ Classical Commentary Integration</li>
                    <li>✓ Scholar-Verified Interpretations</li>
                    <li>✓ Cultural Advisory Board</li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Refined */}
      <section className="bg-gradient-to-r from-flowing-water to-bamboo-green px-4 py-24 text-cloud-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-bold leading-tight lg:text-5xl">
            Begin Your Journey of Wisdom
          </h2>
          <p className="mb-10 text-xl leading-relaxed opacity-90">
            Join thousands of seekers who&apos;ve found clarity and guidance
            through the timeless wisdom of the I Ching.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/guidance">
              <Button variant="secondary" size="lg" className="min-w-48">
                Start with Daily Guidance
              </Button>
            </Link>
            <Link href="/auth/signup" className="inline-block">
              <Button
                variant="outline"
                size="lg"
                className="min-w-48 border-cloud-white bg-transparent text-cloud-white hover:bg-cloud-white hover:text-flowing-water"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm opacity-75">
            Free forever • No credit card required • Respectful of your privacy
          </p>
        </div>
      </section>
    </Layout>
  );
}
