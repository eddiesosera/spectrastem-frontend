import React, { useState, useEffect, useRef } from "react";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [stemsDropdownOpen, setStemsDropdownOpen] = useState(false);
  const [midiDropdownOpen, setMidiDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Refs for detecting outside clicks to close menu and profile dropdown
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close menus when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    if (menuOpen || profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, profileDropdownOpen]);

  return (
    <nav className="bg-white border-b shadow-sm relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left Section: Logo */}
          <div className="flex items-center">
            <img
              src="/path/to/logo.png"
              alt="SpectraStem Logo"
              className="h-8 w-8 mr-2"
            />
            <span className="text-xl font-semibold text-gray-800">
              SpectraStem
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            <div className="relative group">
              <button className="text-gray-700 hover:text-black focus:outline-none">
                Stems
              </button>
              <div className="absolute hidden group-hover:block bg-white shadow-lg rounded p-2 mt-2">
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  Instrument & Vox
                </a>
              </div>
            </div>
            <div className="relative group">
              <button className="text-black font-semibold hover:text-black focus:outline-none">
                Midi
              </button>
              <div className="absolute hidden group-hover:block bg-white shadow-lg rounded p-2 mt-2">
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  Option 1
                </a>
              </div>
            </div>
            <a href="#" className="text-gray-700 hover:text-black">
              Sheet
            </a>
            <a href="#" className="text-gray-700 hover:text-black">
              About
            </a>
          </div>

          {/* Right Section: Profile Icon */}
          <div
            className="hidden md:flex items-center space-x-4 relative"
            ref={profileRef}
          >
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="focus:outline-none"
            >
              <img
                src="/path/to/profile-pic.jpg"
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  My Account
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Billing
                </a>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {/* Hamburger Icon */}
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Floating Mobile Dropdown Menu */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 w-60 space-y-2 z-50"
          >
            <div>
              <button
                onClick={() => setStemsDropdownOpen(!stemsDropdownOpen)}
                className="flex justify-between w-full text-left text-gray-700 hover:text-black font-semibold"
              >
                Stems
                <span>{stemsDropdownOpen ? "▲" : "▼"}</span>
              </button>
              {stemsDropdownOpen && (
                <div className="pl-4 mt-1">
                  <a href="#" className="block text-gray-600 hover:text-black">
                    Instrument & Vox
                  </a>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setMidiDropdownOpen(!midiDropdownOpen)}
                className="flex justify-between w-full text-left text-gray-700 hover:text-black font-semibold"
              >
                Midi
                <span>{midiDropdownOpen ? "▲" : "▼"}</span>
              </button>
              {midiDropdownOpen && (
                <div className="pl-4 mt-1">
                  <a href="#" className="block text-gray-600 hover:text-black">
                    Option 1
                  </a>
                </div>
              )}
            </div>

            <a href="#" className="block text-gray-700 hover:text-black">
              Sheet
            </a>
            <a href="#" className="block text-gray-700 hover:text-black">
              About
            </a>

            <div className="mt-4 flex items-center border border-gray-300 rounded-full p-2">
              <img
                src="/path/to/profile-pic.jpg"
                alt="Profile"
                className="h-8 w-8 rounded-full mr-2"
              />
              <a
                href="#"
                className="text-gray-700 font-semibold hover:text-black"
              >
                My Account
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
