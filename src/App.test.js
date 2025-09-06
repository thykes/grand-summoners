// src/App.test.js
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock firebase/functions
jest.mock('firebase/functions', () => ({
  getFunctions: jest.fn(),
  httpsCallable: jest.fn(() => () => Promise.resolve({ data: {} })),
}));

// Mock Firestore hook (force arrays instead of undefined)
jest.mock('./hooks/useFirestoreData', () => ({
  useFirestoreData: () => ({
    allUnits: [],       // make sure always an array
    allBosses: [],
    allEquipment: [],
    allGuides: [],
    isLoading: false,
    error: null,
  }),
}));

// Mock react-markdown (avoid ESM issues)
jest.mock('react-markdown', () => (props) => {
  return <div data-testid="mock-react-markdown">{props.children}</div>;
});

// Mock remark-gfm (avoid ESM issues)
jest.mock('remark-gfm', () => () => {
  return () => null;
});

// Mock NavBar (prevent TierListPage from running .filter())
jest.mock('./components/NavBar', () => () => {
  return <nav>Mocked NavBar</nav>;
});

test('renders app without crashing', () => {
  render(<App />);
  expect(screen.getByRole('navigation')).toBeInTheDocument();
});
