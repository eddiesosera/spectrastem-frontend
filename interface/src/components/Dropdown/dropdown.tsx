import React, { useState, useEffect, useRef } from "react";
import DropdownManager from "./dropdown_manager";

interface DropdownProps {
  id: string;
  header: React.ReactNode;
  items: { label: string; onClick: () => void }[];
  children?: React.ReactNode;
  alignRight?: boolean; // Optional: Align dropdown to the right
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  header,
  items,
  children,
  alignRight = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownManager = DropdownManager.getInstance();

  const toggleDropdown = () => {
    if (!isOpen) {
      dropdownManager.openDropdown(id, closeDropdown); // Open the dropdown
      setIsOpen(true);
    } else {
      closeDropdown(); // Close the dropdown
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
    dropdownManager.closeDropdown(); // Explicitly notify DropdownManager
  };

  useEffect(() => {
    // Handle click outside to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <div
        onClick={toggleDropdown}
        className="focus:outline-none cursor-pointer"
      >
        {header}
      </div>
      {isOpen && (
        <div
          className={`absolute top-full mt-2 bg-white border shadow-lg rounded-lg py-2 w-48 z-50 ${
            alignRight ? "right-0" : ""
          }`}
        >
          {items.map((item, index) => (
            <a
              key={index}
              href="#"
              onClick={() => {
                item.onClick();
                closeDropdown();
              }}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              {item.label}
            </a>
          ))}
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
