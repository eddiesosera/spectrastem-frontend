import { MenuItem } from "../../interface/components/navbar_interface";
import { DropdownHeader } from "../Dropdown/dropdown_header";

export const desktopItems: MenuItem[] = [
  {
    type: "dropdown",
    id: "stemsDropdown",
    header: <DropdownHeader label="Stems" dropdownId="stemsDropdown" />,
    items: [
      {
        label: "Instrument & Vocals",
        onClick: () => console.log("Instrument & Vox clicked"),
      },
      {
        label: "All Stems",
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
        label: "Extract Midi",
        onClick: () => console.log("Option 1 clicked"),
      },
    ],
  },
  // {
  //   type: "link",
  //   label: "Sheet",
  //   href: "#",
  // },
  {
    type: "link",
    label: "Contact",
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
