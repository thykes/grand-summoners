// src/components/NavBar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
  const activeLinkStyle = {
    backgroundColor: '#06b6d4', // Tailwind cyan-500
    color: 'white',
    boxShadow: '0 0 15px -3px rgba(6, 182, 212, 0.5)',
  };

  return (
    <header className="w-full flex justify-center sticky top-4 z-50 mb-8">
      <nav className="flex flex-wrap justify-center p-2 gap-2 bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-full shadow-lg">
        <NavLink to="/" className="btn-secondary" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
          Event Team Builder
        </NavLink>
        <NavLink to="/tierlist" className="btn-secondary" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
          Tier List
        </NavLink>
        <NavLink to="/builder" className="btn-secondary" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
          General Team Builder
        </NavLink>
        <NavLink to="/units" className="btn-secondary" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
          Manage My Units
        </NavLink>
        <NavLink to="/equipment" className="btn-secondary" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
          Manage My Equipment
        </NavLink>
        <NavLink to="/bosses" className="btn-secondary" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
          Bosses
        </NavLink>
        <NavLink to="/guides" className="btn-secondary" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
          Guides
        </NavLink>
      </nav>
    </header>
  );
}
