import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from './NavBar';

// ✅ Mock Firestore hook
jest.mock('../hooks/useFirestoreData', () => ({
  useFirestoreData: () => ({
    allUnits: [],
    allBosses: [],
    allEquipment: [],
    allGuides: [],
    isLoading: false,
    error: null,
  }),
}));

describe('NavBar', () => {
  test('renders NavBar with Home link', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });
});
