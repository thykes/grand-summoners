import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: "Home" },
    { to: "/tierlist", label: "Tier List" },
    { to: "/units", label: "Manage My Units" },
    { to: "/equipment", label: "Manage My Equipment" },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-gray-900/70 mb-8">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="flex items-center justify-between py-3">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-white font-extrabold tracking-wide">Grand Summoners Tools</span>
          </NavLink>

          {/* Mobile toggle */}
          <button
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-controls="primary-navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Toggle navigation</span>
            {/* Icon */}
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Links - desktop */}
          <ul className="hidden sm:flex flex-wrap items-center gap-3 text-sm font-medium text-gray-300" id="primary-navigation" role="menubar">
            {links.map((link) => (
              <li key={link.to} role="none">
                <NavLink
                  to={link.to}
                  role="menuitem"
                  className={({ isActive }) => {
                    const base = "px-4 py-2 radius-pill border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/60";
                    const inactive = "bg-gray-800/50 border-gray-700/60 text-gray-300 hover:bg-gray-700/60 hover:text-white";
                    const active = "bg-cyan-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/30";
                    return `${base} ${isActive ? active : inactive}`;
                  }}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Links - mobile */}
        {open && (
          <div className="sm:hidden pb-3" id="primary-navigation">
            <ul className="grid grid-cols-1 gap-2 text-sm font-medium text-gray-300">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => {
                      const base = "block w-full px-4 py-2 radius-pill border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/60";
                      const inactive = "bg-gray-800/50 border-gray-700/60 text-gray-300 hover:bg-gray-700/60 hover:text-white";
                      const active = "bg-cyan-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/30";
                      return `${base} ${isActive ? active : inactive}`;
                    }}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
