module.exports = {
  extends: ['next/core-web-vitals'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: [],
  rules: {
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-img-element': 'error',
  },
  overrides: [
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
  ignorePatterns: [
    '.next/',
    'node_modules/',
    'coverage/',
    'public/',
    '*.config.js',
  ],
};
