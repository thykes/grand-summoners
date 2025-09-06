// src/components/BattlePlanDisplay.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import BattlePlanDisplay from './BattlePlanDisplay';

describe('BattlePlanDisplay', () => {
  const fakeUnits = [
    {
      Unit_Name: 'Hero A',
      Thumbnail_URL: 'https://example.com/hero-a.png',
    },
  ];

  const fakePlan = `
### Overall Strategy
Use burst damage to finish quickly.

### Unit Roles & Loadout
**Hero A** Will focus on DPS and support. Use crit gear.

### Execution
Open with buffs, then unleash main damage skills.
`;

  test('renders overall strategy section', () => {
    render(<BattlePlanDisplay plan={fakePlan} allUnits={fakeUnits} onUnitClick={jest.fn()} />);
    expect(screen.getByText(/Overall Strategy/i)).toBeInTheDocument();
    expect(screen.getByText(/Use burst damage/i)).toBeInTheDocument();
  });

  test('renders unit roles section with unit image and clickable unit', () => {
    const handleUnitClick = jest.fn();
    render(<BattlePlanDisplay plan={fakePlan} allUnits={fakeUnits} onUnitClick={handleUnitClick} />);
    
    const heroImg = screen.getByAltText('Hero A');
    expect(heroImg).toBeInTheDocument();

    fireEvent.click(heroImg);
    expect(handleUnitClick).toHaveBeenCalledWith(fakeUnits[0]);
  });

  test('renders execution section', () => {
    render(<BattlePlanDisplay plan={fakePlan} allUnits={fakeUnits} onUnitClick={jest.fn()} />);
    expect(screen.getByText(/Execution/i)).toBeInTheDocument();
    expect(screen.getByText(/Open with buffs/i)).toBeInTheDocument();
  });
});
