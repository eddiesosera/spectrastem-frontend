import { MenuItem } from "../../interface/components/navbar_interface";
import { DropdownHeader } from "../Dropdown/dropdown_header";

export const desktopItems: MenuItem[] = [
  {
    type: "dropdown",
    id: "stemsDropdown",
    header: <DropdownHeader label="Stems" dropdownId="stemsDropdown" />,
    items: [
      {
        label: "Instrument & Vox",
        onClick: () => console.log("Instrument & Vox clicked"),
      },
    ],
  },
  {
    type: "dropdown",
    id: "midiDropdown",
    header: <DropdownHeader label="Midi" dropdownId="midiDropdown" />,
    items: [
      {
        label: "Option 1",
        onClick: () => console.log("Option 1 clicked"),
      },
      {
        label: "Option 2",
        onClick: () => console.log("Option 2 clicked"),
      },
    ],
  },
  {
    type: "link",
    label: "Sheet",
    href: "#",
  },
  {
    type: "link",
    label: "About",
    href: "#",
  },
];

export const profileDropdownItems = [
  {
    label: "My Account",
    onClick: () => console.log("My Account clicked"),
  },
  {
    label: "Billing",
    onClick: () => console.log("Billing clicked"),
  },
];
