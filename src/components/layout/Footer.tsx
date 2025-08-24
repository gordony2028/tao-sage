import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-mountain-stone text-cloud-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-flowing-water to-bamboo-green">
                <span className="text-sm font-bold text-cloud-white">道</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">Sage</span>
                <span className="-mt-1 text-xs text-gentle-silver">
                  The Way of Wisdom
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gentle-silver">
              Ancient wisdom meets modern AI. Find guidance through the timeless
              teachings of the I Ching.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="mb-4 font-semibold">Features</h3>
            <ul className="space-y-2 text-sm text-gentle-silver">
              <li>
                <Link
                  href="/guidance"
                  className="transition-colors hover:text-cloud-white"
                >
                  Daily Guidance
                </Link>
              </li>
              <li>
                <Link
                  href="/consultation"
                  className="transition-colors hover:text-cloud-white"
                >
                  I Ching Consultation
                </Link>
              </li>
              <li>
                <Link
                  href="/history"
                  className="transition-colors hover:text-cloud-white"
                >
                  Consultation History
                </Link>
              </li>
              <li>
                <Link
                  href="/cultural-progress"
                  className="transition-colors hover:text-cloud-white"
                >
                  Cultural Progress
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h3 className="mb-4 font-semibold">Learn</h3>
            <ul className="space-y-2 text-sm text-gentle-silver">
              <li>
                <Link
                  href="/learn/basics"
                  className="transition-colors hover:text-cloud-white"
                >
                  I Ching Basics
                </Link>
              </li>
              <li>
                <Link
                  href="/learn/hexagrams"
                  className="transition-colors hover:text-cloud-white"
                >
                  64 Hexagrams
                </Link>
              </li>
              <li>
                <Link
                  href="/learn/philosophy"
                  className="transition-colors hover:text-cloud-white"
                >
                  Taoist Philosophy
                </Link>
              </li>
              <li>
                <Link
                  href="/learn/faq"
                  className="transition-colors hover:text-cloud-white"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 font-semibold">Support</h3>
            <ul className="space-y-2 text-sm text-gentle-silver">
              <li>
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-cloud-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-cloud-white"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-cloud-white"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/cultural-respect"
                  className="transition-colors hover:text-cloud-white"
                >
                  Cultural Respect
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between border-t border-gentle-silver/20 pt-8 md:flex-row">
          <p className="text-sm text-gentle-silver">
            © 2024 Sage. Built with respect for ancient wisdom traditions.
          </p>
          <p className="mt-2 text-sm text-gentle-silver md:mt-0">
            Made with ❤️ for seekers of wisdom
          </p>
        </div>
      </div>
    </footer>
  );
}
