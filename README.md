# Sage - AI-Powered I Ching Life Guidance

Sage is a revolutionary AI-powered mobile application that transforms the ancient Chinese I Ching (Yijing) from a passive oracle into a proactive, personalized life guidance system.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS with custom Taoist-inspired design system
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4 API
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Development Setup

### Prerequisites

- Node.js 18.17.0+
- pnpm 8.6.12+

### Installation

1. Clone the repository:

```bash
git clone https://github.com/gordony2028/tao-sage.git
cd tao-sage
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your actual API keys
```

4. Run development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm test         # Run tests
pnpm type-check   # Run TypeScript checks
```

## Project Structure

```
src/
├── app/          # Next.js app router pages
├── components/   # React components
├── lib/          # Utility functions and libraries
├── types/        # TypeScript type definitions
├── hooks/        # Custom React hooks
├── constants/    # App constants
└── styles/       # Global styles
```

## Cultural Authenticity

This project prioritizes authentic representation of I Ching wisdom:

- Partnership with I Ching scholars
- Culturally sensitive AI interpretations
- Educational content about I Ching significance
- Respectful integration of ancient wisdom with modern technology

## License

Proprietary - All rights reserved
