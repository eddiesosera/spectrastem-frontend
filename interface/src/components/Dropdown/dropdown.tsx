// Dropdown.tsx
import React, { useState, useEffect, useRef } from "react";
import DropdownManager from "./dropdown_manager";

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  header: React.ReactNode;
  items: { label: string; onClick: () => void }[];
  children?: React.ReactNode;
  alignRight?: boolean;
  alignTop?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  header,
  items,
  children,
  alignRight = false,
  alignTop = false,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownManager = DropdownManager.getInstance();

  const toggleDropdown = () => {
    if (!isOpen) {
      dropdownManager.openDropdown(id, closeDropdown);
      setIsOpen(true);
    } else {
      closeDropdown();
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
    dropdownManager.closeDropdown();
  };

  useEffect(() => {
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
    <div ref={dropdownRef} className="relative" {...rest}>
      <div
        onClick={toggleDropdown}
        className="focus:outline-none cursor-pointer"
      >
        {header}
      </div>
      {isOpen && (
        <div
          className={`absolute bg-white border shadow-lg rounded-lg py-2 w-48 z-50 ${
            alignRight ? "right-0" : ""
          } ${alignTop ? "bottom-full mb-2" : "top-full mt-2"}`}
        >
          {items.map((item, index) => (
            <a
              key={index}
              href="#"
              onClick={() => {
                item.onClick();
                closeDropdown();
              }}
              className="block text-sm px-4 py-2 text-gray-700 hover:bg-gray-100"
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
