# Sage Development Tools Setup

## Complete Development Environment Configuration

**Version:** 1.0  
**Date:** July 30, 2025  
**Stack:** Next.js 14, TypeScript, Supabase, OpenAI, Tailwind CSS  
**Philosophy:** Solo-friendly, automated quality, cultural authenticity focus

---

## Table of Contents

1. [Prerequisites & Environment Setup](#1-prerequisites--environment-setup)
2. [IDE Configuration](#2-ide-configuration)
3. [Code Quality Tools](#3-code-quality-tools)
4. [Git Workflow Tools](#4-git-workflow-tools)
5. [Build & Development Tools](#5-build--development-tools)
6. [Testing Tools Setup](#6-testing-tools-setup)
7. [Debugging Tools](#7-debugging-tools)
8. [Performance Monitoring](#8-performance-monitoring)
9. [Cultural Validation Tools](#9-cultural-validation-tools)
10. [Deployment Tools](#10-deployment-tools)
11. [Automation Scripts](#11-automation-scripts)
12. [Troubleshooting Guide](#12-troubleshooting-guide)

---

## 1. Prerequisites & Environment Setup

### 1.1 Required Software

**Node.js Environment**

```bash
# Install Node.js 18.17.0+ (LTS recommended)
# Using nvm for version management
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18.17.0
nvm use 18.17.0
nvm alias default 18.17.0

# Verify installation
node --version  # Should show v18.17.0+
npm --version   # Should show 9.6.7+
```

**Package Manager**

```bash
# Enable Corepack for pnpm (recommended for faster installs)
corepack enable
corepack prepare pnpm@8.6.12 --activate

# Alternative: Install pnpm globally
npm install -g pnpm@8.6.12

# Verify pnpm installation
pnpm --version  # Should show 8.6.12+
```

**Git Configuration**

```bash
# Configure Git with your information
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set up Git aliases for productivity
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'
```

### 1.2 Environment Variables Setup

**Environment Files**

```bash
# Create environment files
touch .env.local .env.example

# .env.example (template for others)
cat > .env.example << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS=false

# Optional: Cultural Expert API (for validation)
CULTURAL_EXPERT_API_KEY=your-expert-api-key
EOF

# .env.local (your actual secrets - never commit this)
cp .env.example .env.local
# Edit .env.local with your actual values
```

**Environment Validation Script**

```typescript
// scripts/validate-env.ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

try {
  envSchema.parse(process.env);
  console.log('✅ Environment variables are valid');
} catch (error) {
  console.error('❌ Invalid environment variables:', error.errors);
  process.exit(1);
}
```

---

## 2. IDE Configuration

### 2.1 VS Code Setup

**Required Extensions**

```json
// .vscode/extensions.json
{
  "recommendations": [
    // Language Support
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",

    // Code Quality
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",

    // Testing
    "orta.vscode-jest",
    "ms-playwright.playwright",

    // Database
    "supabase.supabase-sql",

    // Productivity
    "christian-kohler.path-intellisense",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",

    // Cultural Support
    "ms-ceintl.vscode-language-pack-zh-hans"
  ]
}
```

**VS Code Settings**

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },

  // TypeScript
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",

  // Tailwind CSS
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],

  // File associations
  "files.associations": {
    "*.css": "tailwindcss"
  },

  // I Ching specific settings
  "files.encoding": "utf8",
  "editor.unicodeHighlight.ambiguousCharacters": false,

  // Testing
  "jest.autoRun": "off",
  "jest.showCoverageOnLoad": true,

  // Search exclusions
  "search.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "**/coverage": true,
    "**/.pnpm-store": true
  }
}
```

**VS Code Tasks**

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "dev",
      "type": "shell",
      "command": "pnpm dev",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "isBackground": true,
      "problemMatcher": {
        "owner": "nextjs",
        "pattern": {
          "regexp": "^\\s*at\\s*(.*?):(\\d+):(\\d+)$",
          "file": 1,
          "line": 2,
          "column": 3
        },
        "background": {
          "activeOnStart": true,
          "beginsPattern": ".*Local:.*",
          "endsPattern": ".*ready in.*"
        }
      }
    },
    {
      "label": "test:watch",
      "type": "shell",
      "command": "pnpm test:watch",
      "group": "test",
      "isBackground": true
    },
    {
      "label": "validate-env",
      "type": "shell",
      "command": "tsx scripts/validate-env.ts",
      "group": "build"
    }
  ]
}
```

**Launch Configuration**

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "pnpm dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Jest: current file",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["${relativeFile}"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### 2.2 Alternative IDE Configurations

**WebStorm/IntelliJ Configuration**

```xml
<!-- .idea/codeStyles/Project.xml -->
<component name="ProjectCodeStyleConfiguration">
  <code_scheme name="Project" version="173">
    <TypeScriptCodeStyleSettings version="0">
      <option name="FORCE_SEMICOLON_STYLE" value="true" />
      <option name="USE_DOUBLE_QUOTES" value="false" />
    </TypeScriptCodeStyleSettings>
  </code_scheme>
</component>
```

---

## 3. Code Quality Tools

### 3.1 ESLint Configuration

**ESLint Setup**

```bash
# Install ESLint and dependencies
pnpm add -D eslint @next/eslint-config-next
pnpm add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
pnpm add -D eslint-plugin-testing-library eslint-plugin-jest-dom
pnpm add -D eslint-plugin-tailwindcss
```

**ESLint Configuration**

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    '@next/eslint-config-next',
    'plugin:@typescript-eslint/recommended',
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended',
    'plugin:tailwindcss/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'testing-library', 'jest-dom', 'tailwindcss'],
  rules: {
    // TypeScript specific
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-const': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',

    // Import organization
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    // Cultural sensitivity
    'no-offensive-language': 'off', // We'll use custom rules for I Ching content

    // Next.js specific
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-img-element': 'error',

    // Tailwind CSS
    'tailwindcss/classnames-order': 'warn',
    'tailwindcss/no-custom-classname': 'off', // Allow custom classes for design system
    'tailwindcss/enforces-negative-arbitrary-values': 'error',

    // Testing
    'testing-library/await-async-query': 'error',
    'testing-library/no-await-sync-query': 'error',
    'jest-dom/prefer-checked': 'error',
    'jest-dom/prefer-enabled-disabled': 'error',
  },
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.test.*'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
    {
      files: ['**/*.config.js', '**/scripts/**'],
      env: {
        node: true,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  ignorePatterns: ['.next/', 'node_modules/', 'coverage/', 'public/', '*.config.js'],
};
```

### 3.2 Prettier Configuration

**Prettier Setup**

```bash
# Install Prettier
pnpm add -D prettier prettier-plugin-tailwindcss
```

**Prettier Configuration**

```json
// .prettierrc.json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "lf",
  "arrowParens": "avoid",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindConfig": "./tailwind.config.js",
  "tailwindFunctions": ["cn", "cva"],
  "overrides": [
    {
      "files": "*.md",
      "options": {
        "printWidth": 120,
        "proseWrap": "preserve"
      }
    },
    {
      "files": "*.json",
      "options": {
        "printWidth": 120
      }
    }
  ]
}
```

**Prettier Ignore**

```gitignore
# .prettierignore
.next/
node_modules/
coverage/
public/
*.min.js
*.min.css
pnpm-lock.yaml
```

### 3.3 TypeScript Configuration

**TypeScript Config**

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/styles/*": ["./src/styles/*"],
      "@/constants/*": ["./src/constants/*"],
      "@/test-utils/*": ["./__tests__/utils/*"]
    },

    // Additional strict checks
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Helpful for debugging
    "sourceMap": true,
    "declaration": false,
    "removeComments": false,
    "preserveConstEnums": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", "**/*.mts"],
  "exclude": ["node_modules", ".next", "coverage", "dist"]
}
```

**Test TypeScript Config**

```json
// tsconfig.test.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": true,
    "types": ["jest", "@testing-library/jest-dom", "node"]
  },
  "include": ["**/__tests__/**/*", "**/*.test.*", "**/*.spec.*", "jest.setup.js", "jest.config.js"]
}
```

---

## 4. Git Workflow Tools

### 4.1 Husky & Lint-Staged Setup

**Husky Installation**

```bash
# Install Husky and lint-staged
pnpm add -D husky lint-staged

# Initialize Husky
npx husky install

# Add to package.json scripts
npm pkg set scripts.prepare="husky install"
```

**Git Hooks Configuration**

```bash
# Pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"

# Pre-push hook
npx husky add .husky/pre-push "pnpm type-check && pnpm test:ci"

# Commit message hook
npx husky add .husky/commit-msg "npx commitlint --edit \$1"
```

**Lint-Staged Configuration**

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write", "bash -c 'pnpm type-check'"],
    "*.{js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"],
    "*.{css,scss}": ["stylelint --fix", "prettier --write"],
    "src/lib/i-ching/**/*.ts": ["npm run validate:cultural-content"]
  }
}
```

### 4.2 Conventional Commits

**Commitlint Setup**

```bash
# Install commitlint
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

**Commitlint Configuration**

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation
        'style', // Code style (formatting, missing semi-colons, etc)
        'refactor', // Code refactoring
        'perf', // Performance improvement
        'test', // Adding or updating tests
        'chore', // Maintenance tasks
        'ci', // CI/CD changes
        'cultural', // I Ching content or cultural accuracy updates
        'i18n', // Internationalization
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'consultation',
        'hexagram',
        'ai',
        'auth',
        'ui',
        'api',
        'db',
        'cultural',
        'performance',
        'accessibility',
        'testing',
        'docs',
        'deps',
      ],
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 100],
  },
};
```

**Commit Message Template**

```bash
# .gitmessage (commit template)
# <type>(<scope>): <subject>
#
# <body>
#
# <footer>

# Example:
# feat(consultation): add AI-powered hexagram interpretation
#
# - Implement OpenAI integration for personalized interpretations
# - Add cultural validation for generated content
# - Include fallback to traditional interpretations
#
# Closes #123

# Set the template
git config commit.template .gitmessage
```

---

## 5. Build & Development Tools

### 5.1 Next.js Configuration

**Next.js Config**

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // PWA configuration for offline consultation
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/consultation/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },

  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Bundle analyzer (development only)
  ...(process.env.ANALYZE === 'true' && {
    experimental: {
      ...nextConfig.experimental,
      bundlePagesExternals: false,
    },
  }),

  // Image optimization
  images: {
    domains: ['supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/oracle',
        destination: '/consultation',
        permanent: true,
      },
    ];
  },
};

// Bundle analyzer setup
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

**Environment Variables Validation**

```typescript
// src/lib/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // Public environment variables
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),

  // Private environment variables (server-side only)
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),

  // Optional variables
  CULTURAL_EXPERT_API_KEY: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const env = envSchema.parse(process.env);

// Type-safe environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
```

### 5.2 Tailwind CSS Configuration

**Tailwind Setup**

```bash
# Install Tailwind CSS
pnpm add -D tailwindcss postcss autoprefixer
pnpm add -D @tailwindcss/forms @tailwindcss/typography
pnpm add -D tailwindcss-animate class-variance-authority clsx tailwind-merge
```

**Tailwind Configuration**

```javascript
// tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // Sage design system colors
      colors: {
        'mountain-stone': '#4a5c6a',
        'flowing-water': '#6b8caf',
        'bamboo-green': '#7ba05b',
        'sunset-gold': '#d4a574',
        'earth-brown': '#8b7355',
        'morning-mist': '#e8f1f5',
        'cloud-white': '#fefefe',
        'ink-black': '#2c2c2c',
        'soft-gray': '#6b6b6b',
        'gentle-silver': '#a8b2b8',

        // Semantic colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      // Typography
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        serif: ['var(--font-crimson)', ...fontFamily.serif],
        mono: ['var(--font-jetbrains)', ...fontFamily.mono],
      },

      // Animation
      keyframes: {
        'natural-spin': {
          '0%': { transform: 'rotateY(0deg) scale(1)' },
          '50%': { transform: 'rotateY(180deg) scale(1.2)' },
          '100%': { transform: 'rotateY(360deg) scale(1)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'natural-spin': 'natural-spin 1.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },

      // Spacing (8px base grid)
      spacing: {
        18: '4.5rem',
        88: '22rem',
      },

      // Box shadows (matching design system)
      boxShadow: {
        'water-shadow': '0 8px 32px rgba(107, 140, 175, 0.15)',
        'mist-glow': '0 4px 20px rgba(232, 241, 245, 0.8)',
        'earth-shadow': '0 6px 24px rgba(139, 115, 85, 0.12)',
        'gentle-shadow': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'floating-shadow': '0 12px 40px rgba(74, 92, 106, 0.2)',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
```

**PostCSS Configuration**

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
  },
};
```

---

## 6. Testing Tools Setup

### 6.1 Jest Configuration

**Jest Setup**

```bash
# Install Jest and testing utilities
pnpm add -D jest jest-environment-jsdom
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D jest-axe
```

**Jest Configuration**

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/test-utils/(.*)$': '<rootDir>/__tests__/utils/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,ts,tsx}',
    '!src/types/**/*',
    '!src/constants/**/*',
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/lib/i-ching/': {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    './src/lib/ai/': {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  testTimeout: 30000,
  testMatch: ['**/__tests__/**/*.(test|spec).(js|ts|tsx)', '**/*.(test|spec).(js|ts|tsx)'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/e2e/'],
  transformIgnorePatterns: ['/node_modules/(?!(.*\\.mjs$|@supabase))'],
};

module.exports = createJestConfig(customJestConfig);
```

**Jest Setup File**

```javascript
// jest.setup.js
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
process.env.OPENAI_API_KEY = 'test-openai-key';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  },
}));

// Mock OpenAI
jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(() =>
          Promise.resolve({
            choices: [{ message: { content: 'Test AI response' } }],
            usage: { total_tokens: 100 },
          })
        ),
      },
    },
  })),
}));

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Custom jest matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});
```

### 6.2 Playwright E2E Setup

**Playwright Installation**

```bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install
```

**Playwright Configuration**

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['json', { outputFile: 'test-results/results.json' }]],

  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  expect: {
    timeout: 10 * 1000,
  },

  outputDir: 'test-results/',
});
```

---

## 7. Debugging Tools

### 7.1 Development Debugging

**Debug Configuration**

```typescript
// src/lib/debug/debug-config.ts
export const DEBUG_CONFIG = {
  enabled: process.env.NODE_ENV === 'development',
  modules: {
    consultation: true,
    ai: true,
    database: true,
    auth: false,
  },
  performance: true,
  verbose: false,
};

export function debug(module: keyof typeof DEBUG_CONFIG.modules, message: string, data?: any) {
  if (!DEBUG_CONFIG.enabled || !DEBUG_CONFIG.modules[module]) return;

  console.group(`🔍 [${module.toUpperCase()}] ${message}`);
  if (data) {
    console.log(data);
  }
  console.groupEnd();
}

export function debugPerformance(label: string, fn: () => any) {
  if (!DEBUG_CONFIG.enabled || !DEBUG_CONFIG.performance) return fn();

  const start = performance.now();
  const result = fn();
  const end = performance.now();

  console.log(`⚡ [PERF] ${label}: ${(end - start).toFixed(2)}ms`);

  return result;
}
```

**React Developer Tools Setup**

```typescript
// src/lib/debug/react-devtools.ts
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Enable React DevTools profiler
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.settings?.profilerEnabled = true;

  // Enable component stack traces
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.settings?.componentStack = true;
}
```

### 7.2 Chrome DevTools Extensions

**Install Useful Extensions**

```bash
# Chrome extensions for development (install manually)
# - React Developer Tools
# - Redux DevTools
# - Lighthouse
# - Web Vitals
# - axe DevTools (accessibility)
# - Wappalyzer (tech stack detection)
```

**Redux DevTools Configuration**

```typescript
// src/store/store.ts (if using Redux)
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // your reducers
  },
  devTools:
    process.env.NODE_ENV !== 'production'
      ? {
          name: 'Sage App',
          trace: true,
          traceLimit: 25,
        }
      : false,
});
```

---

## 8. Performance Monitoring

### 8.1 Bundle Analysis

**Bundle Analyzer Setup**

```bash
# Install bundle analyzer
pnpm add -D @next/bundle-analyzer
```

**Bundle Analysis Scripts**

```json
// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true pnpm build",
    "analyze:server": "BUNDLE_ANALYZE=server pnpm build",
    "analyze:browser": "BUNDLE_ANALYZE=browser pnpm build"
  }
}
```

### 8.2 Performance Monitoring

**Web Vitals Tracking**

```typescript
// src/lib/performance/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  if (process.env.NODE_ENV === 'production') {
    // Send to your analytics service
    console.log('Web Vital:', metric);
  }
}

export function initWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
```

**Performance Budgets**

```javascript
// performance-budget.config.js
module.exports = {
  budgets: [
    {
      path: '/',
      resourceSizes: [
        { resourceType: 'script', budget: 300 }, // 300KB
        { resourceType: 'total', budget: 500 }, // 500KB
      ],
      resourceCounts: [{ resourceType: 'third-party', budget: 10 }],
    },
    {
      path: '/consultation',
      resourceSizes: [
        { resourceType: 'script', budget: 400 }, // Allow more for AI features
        { resourceType: 'total', budget: 600 },
      ],
    },
  ],
};
```

---

## 9. Cultural Validation Tools

### 9.1 I Ching Content Validation

**Cultural Validation Scripts**

```typescript
// scripts/validate-cultural-content.ts
import { HEXAGRAMS_DB } from '../src/lib/i-ching/hexagrams-data';
import { validateChineseCharacters } from '../src/lib/cultural/validation';

interface ValidationResult {
  hexagramNumber: number;
  issues: string[];
  passed: boolean;
}

function validateHexagramContent(): ValidationResult[] {
  const results: ValidationResult[] = [];

  HEXAGRAMS_DB.forEach((hexagram, index) => {
    const issues: string[] = [];

    // Validate Chinese characters
    if (!validateChineseCharacters(hexagram.chinese)) {
      issues.push('Invalid Chinese characters');
    }

    // Check for fortune-telling language
    const problematicTerms = ['will', 'definitely', 'guaranteed', 'never', 'always'];
    const content = `${hexagram.meaning} ${hexagram.judgment} ${hexagram.image}`.toLowerCase();

    problematicTerms.forEach(term => {
      if (content.includes(term)) {
        issues.push(`Contains problematic term: "${term}"`);
      }
    });

    // Validate traditional structure
    if (!hexagram.judgment || !hexagram.image) {
      issues.push('Missing traditional components');
    }

    results.push({
      hexagramNumber: hexagram.number,
      issues,
      passed: issues.length === 0,
    });
  });

  return results;
}

// Run validation
const validationResults = validateHexagramContent();
const failedResults = validationResults.filter(r => !r.passed);

if (failedResults.length > 0) {
  console.error('❌ Cultural validation failed:');
  failedResults.forEach(result => {
    console.error(`Hexagram ${result.hexagramNumber}:`);
    result.issues.forEach(issue => console.error(`  - ${issue}`));
  });
  process.exit(1);
} else {
  console.log('✅ All cultural validation checks passed');
}
```

**AI Content Validation**

```typescript
// scripts/validate-ai-responses.ts
import { validateCulturalContent } from '../src/lib/cultural/validation';

interface AIResponseTest {
  prompt: string;
  response: string;
  expectedCultural: boolean;
}

const testResponses: AIResponseTest[] = [
  {
    prompt: 'Career guidance',
    response: 'The I Ching wisdom suggests reflecting on balance...',
    expectedCultural: true,
  },
  {
    prompt: 'Fortune telling',
    response: 'You will definitely win the lottery tomorrow...',
    expectedCultural: false,
  },
];

function validateAIResponses() {
  let passed = 0;
  let failed = 0;

  testResponses.forEach((test, index) => {
    const isValid = validateCulturalContent.avoidDivinationClaims(test.response);

    if (isValid === test.expectedCultural) {
      console.log(`✅ Test ${index + 1} passed`);
      passed++;
    } else {
      console.error(`❌ Test ${index + 1} failed`);
      console.error(`Expected: ${test.expectedCultural}, Got: ${isValid}`);
      console.error(`Response: "${test.response}"`);
      failed++;
    }
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    process.exit(1);
  }
}

validateAIResponses();
```

---

## 10. Deployment Tools

### 10.1 Vercel Configuration

**Vercel Configuration**

```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["sfo1", "lhr1"],

  "functions": {
    "src/app/api/consultation/create/route.ts": {
      "maxDuration": 30
    },
    "src/app/api/ai/interpret/route.ts": {
      "maxDuration": 60
    }
  },

  "crons": [
    {
      "path": "/api/cron/daily-wisdom",
      "schedule": "0 6 * * *"
    }
  ],

  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-store, max-age=0"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],

  "redirects": [
    {
      "source": "/oracle",
      "destination": "/consultation",
      "permanent": true
    }
  ]
}
```

**Environment Variables Deployment**

```bash
# Vercel CLI setup
npm install -g vercel

# Deploy with environment variables
vercel --prod

# Set environment variables
vercel env add OPENAI_API_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add CULTURAL_EXPERT_API_KEY
```

### 10.2 Docker Configuration (Alternative)

**Dockerfile**

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN corepack enable pnpm && pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**Docker Compose**

```yaml
# docker-compose.yml
version: '3.8'

services:
  sage-app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - sage-app
    restart: unless-stopped
```

---

## 11. Automation Scripts

### 11.1 Package.json Scripts

**Complete Scripts Configuration**

```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",

    "test": "jest",
    "test:watch": "jest --watch",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:unit": "jest --testPathIgnorePatterns=e2e",
    "test:integration": "jest --testPathPattern=integration",
    "test:coverage": "jest --coverage",

    "cultural:validate": "tsx scripts/validate-cultural-content.ts",
    "ai:validate": "tsx scripts/validate-ai-responses.ts",
    "i18n:extract": "tsx scripts/extract-i18n.ts",

    "db:generate-types": "supabase gen types typescript --local > src/types/database.ts",
    "db:reset": "supabase db reset",
    "db:migrate": "supabase migration up",

    "analyze": "ANALYZE=true pnpm build",
    "lighthouse": "lhci autorun",
    "perf:audit": "tsx scripts/performance-audit.ts",

    "prepare": "husky install",
    "postinstall": "tsx scripts/validate-env.ts",
    "clean": "rm -rf .next node_modules coverage test-results",

    "deploy:staging": "vercel --target staging",
    "deploy:production": "vercel --prod",

    "setup": "tsx scripts/setup-project.ts",
    "health-check": "tsx scripts/health-check.ts"
  }
}
```

### 11.2 Utility Scripts

**Project Setup Script**

```typescript
// scripts/setup-project.ts
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

async function setupProject() {
  console.log('🚀 Setting up Sage development environment...');

  // Check Node.js version
  const nodeVersion = process.version;
  const requiredVersion = '18.17.0';

  if (nodeVersion < `v${requiredVersion}`) {
    console.error(`❌ Node.js ${requiredVersion}+ required. Current: ${nodeVersion}`);
    process.exit(1);
  }

  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('pnpm install', { stdio: 'inherit' });

  // Setup environment files
  if (!fs.existsSync('.env.local')) {
    console.log('📝 Creating .env.local from template...');
    fs.copyFileSync('.env.example', '.env.local');
    console.log('⚠️  Please update .env.local with your actual API keys');
  }

  // Setup Git hooks
  console.log('🪝 Setting up Git hooks...');
  execSync('npx husky install', { stdio: 'inherit' });

  // Validate cultural content
  console.log('🏮 Validating I Ching cultural content...');
  execSync('pnpm cultural:validate', { stdio: 'inherit' });

  // Run initial tests
  console.log('🧪 Running initial tests...');
  execSync('pnpm test:ci', { stdio: 'inherit' });

  console.log('✅ Setup complete! Run `pnpm dev` to start development.');
}

setupProject().catch(error => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});
```

**Health Check Script**

```typescript
// scripts/health-check.ts
import { execSync } from 'child_process';

interface HealthCheck {
  name: string;
  check: () => Promise<boolean>;
  critical: boolean;
}

const healthChecks: HealthCheck[] = [
  {
    name: 'Environment Variables',
    check: async () => {
      try {
        execSync('tsx scripts/validate-env.ts', { stdio: 'pipe' });
        return true;
      } catch {
        return false;
      }
    },
    critical: true,
  },
  {
    name: 'TypeScript Compilation',
    check: async () => {
      try {
        execSync('pnpm type-check', { stdio: 'pipe' });
        return true;
      } catch {
        return false;
      }
    },
    critical: true,
  },
  {
    name: 'ESLint',
    check: async () => {
      try {
        execSync('pnpm lint', { stdio: 'pipe' });
        return true;
      } catch {
        return false;
      }
    },
    critical: false,
  },
  {
    name: 'Cultural Content Validation',
    check: async () => {
      try {
        execSync('pnpm cultural:validate', { stdio: 'pipe' });
        return true;
      } catch {
        return false;
      }
    },
    critical: true,
  },
  {
    name: 'Unit Tests',
    check: async () => {
      try {
        execSync('pnpm test:unit --passWithNoTests', { stdio: 'pipe' });
        return true;
      } catch {
        return false;
      }
    },
    critical: true,
  },
];

async function runHealthChecks() {
  console.log('🏥 Running health checks...\n');

  let passed = 0;
  let critical_failed = 0;

  for (const check of healthChecks) {
    process.stdout.write(`${check.name}... `);

    try {
      const result = await check.check();

      if (result) {
        console.log('✅ PASS');
        passed++;
      } else {
        console.log(check.critical ? '❌ FAIL (CRITICAL)' : '⚠️ FAIL');
        if (check.critical) critical_failed++;
      }
    } catch (error) {
      console.log(check.critical ? '❌ ERROR (CRITICAL)' : '⚠️ ERROR');
      if (check.critical) critical_failed++;
    }
  }

  console.log(`\n📊 Results: ${passed}/${healthChecks.length} checks passed`);

  if (critical_failed > 0) {
    console.log(`❌ ${critical_failed} critical checks failed`);
    process.exit(1);
  } else {
    console.log('✅ All critical checks passed');
  }
}

runHealthChecks();
```

---

## 12. Troubleshooting Guide

### 12.1 Common Issues & Solutions

**TypeScript Issues**

```bash
# Clear TypeScript cache
rm -rf .next/cache
rm -rf node_modules/.cache

# Restart TypeScript language server in VS Code
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"

# Check TypeScript version
pnpm list typescript
```

**ESLint/Prettier Conflicts**

```bash
# Check for conflicting rules
npx eslint-config-prettier src/components/Button.tsx

# Fix formatting conflicts
pnpm format && pnpm lint:fix
```

**Supabase Connection Issues**

```typescript
// Debug connection
import { supabase } from '@/lib/supabase/client';

// Test connection
const { data, error } = await supabase.from('consultations').select('id').limit(1);

console.log('Supabase connection:', { data, error });
```

**OpenAI API Issues**

```typescript
// Debug OpenAI connection
import { openai } from '@/lib/ai/client';

try {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'Hello' }],
    max_tokens: 10,
  });
  console.log('OpenAI connection successful');
} catch (error) {
  console.error('OpenAI connection failed:', error);
}
```

**Build Issues**

```bash
# Clear Next.js cache
rm -rf .next
pnpm build

# Check bundle size
pnpm analyze

# Debug build issues
DEBUG=1 pnpm build
```

### 12.2 Performance Issues

**Slow Development Server**

```bash
# Check Node.js version
node --version  # Should be 18.17.0+

# Clear all caches
pnpm clean
rm -rf node_modules
pnpm install

# Use faster package manager
corepack enable
corepack prepare pnpm@latest --activate
```

**Memory Issues**

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Or add to package.json scripts
"dev": "NODE_OPTIONS='--max-old-space-size=4096' next dev"
```

### 12.3 Testing Issues

**Jest Configuration Problems**

```bash
# Clear Jest cache
npx jest --clearCache

# Debug Jest configuration
npx jest --showConfig

# Run specific test file
pnpm test src/components/Button.test.tsx
```

**Playwright Issues**

```bash
# Install Playwright browsers
npx playwright install

# Debug Playwright tests
npx playwright test --debug

# Run tests in headed mode
npx playwright test --headed
```

---

## Quick Start Checklist

When setting up a new development environment:

- [ ] Install Node.js 18.17.0+
- [ ] Install pnpm via Corepack
- [ ] Clone repository and run `pnpm setup`
- [ ] Copy `.env.example` to `.env.local` and configure
- [ ] Install VS Code extensions
- [ ] Run `pnpm health-check` to verify setup
- [ ] Run `pnpm dev` to start development server
- [ ] Run `pnpm test` to verify tests pass
- [ ] Run `pnpm cultural:validate` to check I Ching content

---

## Development Workflow

### Daily Development

1. `git pull origin main`
2. `pnpm install` (if package.json changed)
3. `pnpm health-check`
4. `pnpm dev`
5. Make changes
6. `pnpm test:watch` (in separate terminal)
7. Commit with conventional commits
8. Push and create PR

### Before Deployment

1. `pnpm health-check`
2. `pnpm build`
3. `pnpm test:ci`
4. `pnpm cultural:validate`
5. `pnpm lighthouse`
6. Deploy to staging
7. Manual testing
8. Deploy to production

This development environment setup ensures high-quality, culturally authentic, and performant development of the Sage I Ching guidance application while maintaining solo developer productivity.
