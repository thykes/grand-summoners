// src/components/AllUnitsPage.test.js
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AllUnitsPage from './AllUnitsPage';

describe('AllUnitsPage', () => {
  test('renders the header', () => {
    render(
      <MemoryRouter>
        <AllUnitsPage
          allUnits={[]}
          myUnits={new Set()}
          onToggleUnit={jest.fn()}
          setSelectedUnit={jest.fn()}
          showMyUnitsFilter={false}
          setShowMyUnitsFilter={jest.fn()}
          onClearAll={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/Unit Database/i)).toBeInTheDocument();
  });

  test('renders units safely even with missing data', () => {
    const brokenUnits = [
      { id: '1' }, // missing Unit_Name
      { id: '2', Unit_Name: 'Hero X', Element: 'Fire' },
    ];

    render(
      <MemoryRouter>
        <AllUnitsPage
          allUnits={brokenUnits}
          myUnits={new Set(['2'])}
          onToggleUnit={jest.fn()}
          setSelectedUnit={jest.fn()}
          showMyUnitsFilter={false}
          setShowMyUnitsFilter={jest.fn()}
          onClearAll={jest.fn()}
        />
      </MemoryRouter>
    );

    // It should render Hero X but not crash on the broken unit
    expect(screen.getByText(/Hero X/i)).toBeInTheDocument();
  });

  test('respects "Show My Units" filter', () => {
    const units = [
      { id: '1', Unit_Name: 'Hero Y', Element: 'Water' },
      { id: '2', Unit_Name: 'Hero Z', Element: 'Earth' },
    ];

    render(
      <MemoryRouter>
        <AllUnitsPage
          allUnits={units}
          myUnits={new Set(['2'])}
          onToggleUnit={jest.fn()}
          setSelectedUnit={jest.fn()}
          showMyUnitsFilter={true}
          setShowMyUnitsFilter={jest.fn()}
          onClearAll={jest.fn()}
        />
      </MemoryRouter>
    );

    // Only Hero Z should appear since filter is ON
    expect(screen.getByText(/Hero Z/i)).toBeInTheDocument();
    expect(screen.queryByText(/Hero Y/i)).not.toBeInTheDocument();
  });

  test('matches snapshot with sample data', () => {
    const units = [
      { id: '1', Unit_Name: 'Hero Alpha', Element: 'Fire' },
      { id: '2', Unit_Name: 'Hero Beta', Element: 'Water' },
    ];

    const { asFragment } = render(
      <MemoryRouter>
        <AllUnitsPage
          allUnits={units}
          myUnits={new Set(['1'])}
          onToggleUnit={jest.fn()}
          setSelectedUnit={jest.fn()}
          showMyUnitsFilter={false}
          setShowMyUnitsFilter={jest.fn()}
          onClearAll={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
