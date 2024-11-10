// DropdownHeader.tsx
import React, { ReactNode, useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import DropdownManager from "./dropdown_manager";

interface DropdownHeaderProps {
  label: string | ReactNode;
  dropdownId: string;
}

export const DropdownHeader: React.FC<DropdownHeaderProps> = ({
  label,
  dropdownId,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const dropdownManager = DropdownManager.getInstance();

  const toggleDropdown = () => {
    const isActive = dropdownManager.isActive(dropdownId);
    if (isActive) {
      dropdownManager.closeDropdown();
    } else {
      dropdownManager.openDropdown(dropdownId, () => setIsClicked(false));
      setIsClicked(true);
    }
  };

  // Listen for changes in active dropdown status
  useEffect(() => {
    const handleDropdownChange = (activeDropdownId: string | null) => {
      setIsClicked(activeDropdownId === dropdownId); // Update chevron based on active state
    };

    // Subscribe to DropdownManager state changes
    dropdownManager.addListener(handleDropdownChange);
    return () => {
      dropdownManager.removeListener(handleDropdownChange);
    };
  }, [dropdownId, dropdownManager]);

  return (
    <div
      className="flex items-center justify-between gap-2 px-4 py-2 rounded cursor-pointer "
      onClick={toggleDropdown}
    >
      <span className="text-sm">{label}</span>
      {!isClicked ? (
        <ChevronDownIcon className="w-4 h-4" />
      ) : (
        <ChevronUpIcon className="w-4 h-4" />
      )}
    </div>
  );
};
