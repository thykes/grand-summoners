// src/components/NavBar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

// Simple navigation bar used across the application.
// The previous file accidentally contained the TierListPage component
// which expected `allUnits` as a prop. Because <NavBar /> is rendered
// without props, calling `allUnits.filter(...)` resulted in
// "Cannot read properties of undefined" runtime errors.  This file
// restores the proper NavBar implementation that only provides links
// to the different sections of the app.

export default function NavBar() {
  const linkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ` +
    (isActive
      ? 'bg-gray-700 text-white'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white');

  return (
    <nav className="w-full mb-8">
      <div className="flex justify-center space-x-2 sm:space-x-4">
        <NavLink to="/" className={linkClasses} end>
          Home
        </NavLink>
        <NavLink to="/tierlist" className={linkClasses}>
          Tier List
        </NavLink>
        <NavLink to="/builder" className={linkClasses}>
          Builder
        </NavLink>
        <NavLink to="/units" className={linkClasses}>
          Units
        </NavLink>
        <NavLink to="/equipment" className={linkClasses}>
          Equipment
        </NavLink>
      </div>
    </nav>
  );
}
