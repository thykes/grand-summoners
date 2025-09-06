// src/setupTests.js

// Add jest-dom matchers (e.g., toBeInTheDocument, toHaveClass, etc.)
import '@testing-library/jest-dom';

// Mock window.scrollTo so tests don’t crash in JSDOM
Object.defineProperty(window, 'scrollTo', {
  value: () => {},
  writable: true,
});
