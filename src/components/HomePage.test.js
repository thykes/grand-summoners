// src/components/HomePage.test.js
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

describe('HomePage', () => {
  test('renders PageHeader with title', () => {
    jest.isolateModules(() => {
      const HomePage = require('./HomePage').default;

      render(
        <BrowserRouter>
          <HomePage
            allUnits={[]}
            allBosses={[]}
            allEquipment={[]}
            allGuides={[]}
            myUnits={new Set()}
            myEquipment={new Map()}
            setSelectedUnit={jest.fn()}
            setSelectedEquip={jest.fn()}
          />
        </BrowserRouter>
      );

      expect(
        screen.getByText(/Event Team Builder/i)
      ).toBeInTheDocument();
    });
  });
});
