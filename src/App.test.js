import { render, screen } from '@testing-library/react';
import App from './App';

// ✅ Mock Firebase functions
jest.mock('firebase/functions', () => ({
  getFunctions: jest.fn(),
  httpsCallable: jest.fn(() => () => Promise.resolve({ data: {} })),
}));

// ✅ Mock Firestore hook (fixed path!)
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

// ✅ Mock react-markdown
jest.mock('react-markdown', () => (props) => {
  return <div data-testid="mock-react-markdown">{props.children}</div>;
});

// ✅ Mock remark-gfm
jest.mock('remark-gfm', () => () => {
  return () => null;
});

test('renders app without crashing', () => {
  render(<App />);
  expect(screen.getByRole('navigation')).toBeInTheDocument();
});
