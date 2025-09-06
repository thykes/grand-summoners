// src/App.test.js
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock Firebase functions
jest.mock('firebase/functions', () => ({
  getFunctions: jest.fn(),
  httpsCallable: jest.fn(() => () => Promise.resolve({ data: {} })),
}));

// Default mock for Firestore hook
jest.mock('./hooks/useFirestoreData', () => ({
  useFirestoreData: () => ({
    allUnits: [],
    allBosses: [],
    allEquipment: [],
    allGuides: [],
    isLoading: false,
    error: null,
  }),
}));

// Mock react-markdown
jest.mock('react-markdown', () => (props) => (
  <div data-testid="mock-react-markdown">{props.children}</div>
));

// Mock remark-gfm
jest.mock('remark-gfm', () => () => {
  return () => null;
});

describe('App', () => {
  test('renders app without crashing', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('renders HomePage when data is loaded', () => {
    jest.doMock('./hooks/useFirestoreData', () => ({
      useFirestoreData: () => ({
        allUnits: [{ id: 'u1', name: 'Hero A' }],
        allBosses: [{ id: 'b1', name: 'Boss X', type: 'Crest Boss' }],
        allEquipment: [],
        allGuides: [{ id: 'g1', name: 'Guide for Boss X' }],
        isLoading: false,
        error: null,
      }),
    }));

    const { default: DataApp } = require('./App');
    render(
      <MemoryRouter>
        <DataApp />
      </MemoryRouter>
    );

    expect(screen.getByText(/Event Team Builder/i)).toBeInTheDocument();
    expect(screen.getByText(/Boss X/i)).toBeInTheDocument();
  });
});
