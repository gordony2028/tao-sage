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
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto text-center">
          <h1 className="mb-6 text-5xl font-bold text-mountain-stone md:text-6xl">
            Sage - The Way of Wisdom
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-soft-gray">
            Ancient I Ching wisdom enhanced by modern AI. Find guidance for
            life&apos;s questions through the timeless teachings of the Book of
            Changes.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/consultation">
              <Button size="lg" className="min-w-48">
                Start Consultation
              </Button>
            </Link>
            <Link href="/learn">
              <Button variant="outline" size="lg" className="min-w-48">
                Learn About I Ching
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-cloud-white/50 px-4 py-16">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center text-3xl font-bold text-mountain-stone">
            Discover Your Path
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card variant="elevated">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-flowing-water to-bamboo-green">
                  <span className="text-xl text-cloud-white">卦</span>
                </div>
                <CardTitle>Personal Consultations</CardTitle>
                <CardDescription>
                  Ask your questions and receive personalized guidance through
                  traditional coin casting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-soft-gray">
                  <li>• Authentic I Ching methodology</li>
                  <li>• AI-enhanced interpretations</li>
                  <li>• Cultural authenticity respected</li>
                </ul>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sunset-gold to-earth-brown">
                  <span className="text-xl text-cloud-white">智</span>
                </div>
                <CardTitle>Daily Guidance</CardTitle>
                <CardDescription>
                  Start each day with wisdom from the 64 hexagrams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-soft-gray">
                  <li>• Daily hexagram insights</li>
                  <li>• Practical life applications</li>
                  <li>• Mindful reflection prompts</li>
                </ul>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-bamboo-green to-flowing-water">
                  <span className="text-xl text-cloud-white">道</span>
                </div>
                <CardTitle>Pattern Recognition</CardTitle>
                <CardDescription>
                  Track patterns in your consultations and spiritual growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-soft-gray">
                  <li>• Consultation history</li>
                  <li>• Personal insights</li>
                  <li>• Growth tracking</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cultural Respect Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-mountain-stone">
              Built with Cultural Respect
            </h2>
            <p className="mb-8 text-lg text-soft-gray">
              We honor the rich traditions of Chinese philosophy and the I
              Ching. Our interpretations are guided by cultural consultants and
              respect the authentic teachings that have guided seekers for over
              3,000 years.
            </p>
            <Link href="/cultural-respect">
              <Button variant="outline">Learn About Our Approach</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-flowing-water to-bamboo-green px-4 py-20 text-cloud-white">
        <div className="container mx-auto text-center">
          <h2 className="mb-6 text-4xl font-bold">Begin Your Journey</h2>
          <p className="mb-8 text-xl opacity-90">
            Take the first step on your path to wisdom and self-discovery.
          </p>
          <Link href="/auth/signup">
            <Button variant="secondary" size="lg">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
