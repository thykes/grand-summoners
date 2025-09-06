export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  // ✅ Transform ESM deps like react-markdown & remark-gfm
  transformIgnorePatterns: [
    '/node_modules/(?!(react-markdown|remark-gfm|unist-util-visit)/)',
  ],
};
