import React, { useEffect, useState } from "react";
import Logo from "../../assets/img/spectrastem_logo_w_v1.png";
import Dropdown from "../Dropdown/dropdown";
import DropdownManager from "./../Dropdown/dropdown_manager";
import { desktopItems, profileDropdownItems } from "./nav_items";
import { Bars3BottomRightIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { RiAccountCircleFill } from "react-icons/ri";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownManager = DropdownManager.getInstance();
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleDropdownChange = (id: string | null) => {
      setActiveDropdownId(id);
    };
    dropdownManager.addListener(handleDropdownChange);
    return () => {
      dropdownManager.removeListener(handleDropdownChange);
    };
  }, [dropdownManager]);

  const MobileMenu = () => {
    return (
      <>
        <Dropdown
          id="mobileStemsDropdown"
          header={
            <span className="text-gray-700 hover:text-black font-semibold">
              Stems
            </span>
          }
          items={[
            {
              label: "Instrument & Vox",
              onClick: () => console.log("Instrument & Vox clicked"),
            },
          ]}
        />
        <Dropdown
          id="mobileMidiDropdown"
          header={
            <span className="text-gray-700 hover:text-black font-semibold">
              Midi
            </span>
          }
          items={[
            {
              label: "Option 1",
              onClick: () => console.log("Option 1 clicked"),
            },
            {
              label: "Option 2",
              onClick: () => console.log("Option 2 clicked"),
            },
          ]}
        />
        <a href="#" className="block text-gray-700 hover:text-black">
          Sheet
        </a>
        <a href="#" className="block text-gray-700 hover:text-black">
          About
        </a>
      </>
    );
  };

  return (
    <nav className="bg-white border-b shadow-sm relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left Section: Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={Logo} alt="SpectraStem Logo" className="h-6 mr-2" />
          </div>

          {/* Middle Section: Dropdown Links */}
          <div className="hidden md:flex space-x-6">
            {desktopItems.map((item) =>
              item.type === "dropdown" ? (
                <Dropdown
                  key={item.id}
                  id={item.id}
                  header={
                    <span
                      className={`text-gray-700 hover:text-black ${
                        dropdownManager.isActive(item.id) ? "font-bold" : ""
                      }`}
                    >
                      {item.header}
                    </span>
                  }
                  items={item.items}
                />
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm text-gray-700 hover:text-black"
                >
                  {item.label}
                </a>
              )
            )}
          </div>

          {/* Right Section: Profile Dropdown */}
          <div className="hidden md:flex items-center space-x-4">
            <Dropdown
              id="profileDropdown"
              header={
                // <img
                //   src="/path/to/profile-pic.jpg"
                //   alt="Profile"
                //   className="h-8 w-8 rounded-full cursor-pointer"
                // />
                <RiAccountCircleFill className="size-6" />
              }
              items={profileDropdownItems}
              alignRight
            />
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              <Bars3BottomRightIcon className="size-6" />
            </button>
          </div>
        </div>

        {/* Floating Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 w-60 space-y-2 z-50">
            <MobileMenu />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
