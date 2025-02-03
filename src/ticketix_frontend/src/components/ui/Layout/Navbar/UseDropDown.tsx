import { Fragment } from "react";
import { Link } from "react-router-dom";

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  CalendarCheck2,
  ChevronDown,
  CircleUserRoundIcon,
  Ticket,
  Tickets,
  Wallet,
} from "lucide-react";

import { useAuthManager } from "@/store/AuthProvider";
import { cn } from "@/lib/utils/cn";
import useUser from "@/hooks/useUser";

export const menuSections = [
  {
    items: [
      { label: "Profile", to: "/dashboard", icon: <CircleUserRoundIcon /> },
      { label: "My Event", to: "/dashboard/event", icon: <CalendarCheck2 /> },
      { label: "My Ticket", to: "/dashboard/ticket", icon: <Ticket /> },
      { label: "Wallet", to: "/dashboard/wallet", icon: <Wallet /> },
      { label: "Explore Event", to: "/event", icon: <Tickets /> },
    ],
    activeClassName: "hover:bg-mainAccent hover:text-white",
  },
  {
    items: [{ label: "Logout", to: undefined, icon: undefined }],
    activeClassName: "hover:bg-mainAccent",
  },
];

const UserDropdown = () => {
  const { logout } = useAuthManager();
  const { user } = useUser();

  return (
    <Menu as="div" className="mt2 relative inline-block text-left">
      {/* Dropdown Button */}
      <MenuButton className={"flex items-center gap-3"}>
        <div className="flex items-center gap-1 text-lg text-blue-800">
          <div className="font-semibold">@{user?.username}</div>
          <ChevronDown />
        </div>
      </MenuButton>

      {/* Dropdown Items */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems
          className={cn(
            "absolute right-0 z-50 mt-3 w-60 origin-top-right divide-y rounded-lg shadow-lg ring-1",
            "divide-blue-500 border-mainAccent bg-blue-300 ring-white"
          )}
        >
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="py-1 font-medium">
              {section.items.map((item, itemIndex) => (
                <MenuItem key={itemIndex}>
                  {item.to ? (
                    <Link
                      to={item.to}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2 text-sm text-blue-600 hover:text-white",
                        section.activeClassName
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ) : (
                    <div
                      onClick={logout}
                      className={cn(
                        "block cursor-pointer px-4 py-2 text-center text-white",
                        section.activeClassName
                      )}
                    >
                      {item.label}
                    </div>
                  )}
                </MenuItem>
              ))}
            </div>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default UserDropdown;
