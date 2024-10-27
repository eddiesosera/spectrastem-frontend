import { ReactNode } from "react";

interface DropdownItem {
  label: string;
  onClick: () => void;
}

interface DropdownMenu {
  type: "dropdown";
  id: string;
  header: string | ReactNode;
  items: DropdownItem[];
}

interface LinkMenu {
  type: "link";
  label: string;
  href: string;
}

export type MenuItem = DropdownMenu | LinkMenu;
