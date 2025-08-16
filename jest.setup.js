import '@testing-library/jest-dom';

// Use real environment variables from .env.local for testing
process.env.NEXT_PUBLIC_SUPABASE_URL =
  'https://vwjwpbgmtfunjyribmrm.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3andwYmdtdGZ1bmp5cmlibXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNTg5NDcsImV4cCI6MjA3MDgzNDk0N30.t0htgZSxB-4Pb1Cl84NCA2jkrIFc_LuwlUL0VxLFacY';
process.env.SUPABASE_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3andwYmdtdGZ1bmp5cmlibXJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTI1ODk0NywiZXhwIjoyMDcwODM0OTQ3fQ.5FGtGaVUTYUVzWJR0iE0irh5fI8nTWEqmfSUW7Cmh7E';
process.env.OPENAI_API_KEY = 'test-openai-key'; // Keep OpenAI mocked to avoid charges

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
