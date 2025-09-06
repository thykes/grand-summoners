// src/setupTests.js

// Add jest-dom matchers (e.g., toBeInTheDocument, toHaveClass, etc.)
import '@testing-library/jest-dom';

// Mock window.scrollTo so tests don’t crash
Object.defineProperty(window, 'scrollTo', {
  value: () => {},
  writable: true,
});

// Suppress act() warnings to keep test output clean
const consoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('ReactDOMTestUtils.act') ||
      args[0].includes('React Router Future Flag Warning'))
  ) {
    return;
  }
  consoleError(...args);
};
