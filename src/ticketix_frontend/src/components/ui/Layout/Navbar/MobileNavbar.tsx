import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User2Icon } from "lucide-react";
import useUser from "@/hooks/useUser";
import { useAuthManager } from "@/store/AuthProvider";
import Drawer from "../../Drawer/Drawer";
import { menuSections } from "./UseDropDown";
import { cn } from "@/lib/utils/cn";
import { Button } from "../../Button/button";

const MobileNavbar = () => {
  const { isAuthenticated, login, logout } = useAuthManager();
  const { user } = useUser();

  const [openMenu, setOpenMenu] = useState(false);

  const regularSections = menuSections.slice(0, -1);
  const logoutSection = menuSections[menuSections.length - 1];

  return (
    <nav className="flex h-[65px] items-center justify-between px-10 z-50">
      <Link to={"/"} className="flex gap-2 justify-center items-center">
        <img
          alt="ticketix logo"
          src="/images/logo/LogoTicketix2.svg"
          loading="eager"
          className="w-12"
        ></img>
        <h1 className="text-xl font-semibold text-mainAccent">TickeTix</h1>
      </Link>

      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <div
            onClick={() => setOpenMenu(true)}
            className="flex size-11 items-center justify-center overflow-hidden rounded-full bg-mainAccent text-white"
          >
            <User2Icon />
          </div>
        ) : (
          <Button
            className="rounded-full bg-mainAccent"
            onClick={() => login()}
          >
            Login
          </Button>
        )}
      </div>

      <Drawer
        isOpen={openMenu}
        onClose={() => setOpenMenu(false)}
        containerClassName="h-[80%]"
      >
        <div className="flex h-full flex-col">
          {/* Main menu sections */}
          <div className="flex-1 overflow-y-auto">
            <div className={cn("space-y-3 p-3 py-4", "divide-[#3E3D39]")}>
              {regularSections.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className="overflow-hidden rounded-lg bg-mainAccent"
                >
                  {section.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      to={item.to ?? ""}
                      onClick={() => setOpenMenu(false)}
                      className={cn(
                        "flex w-full items-center gap-1.5 px-4 py-3 text-base font-medium text-white",
                        "transition-colors duration-150",
                        "border-b border-[#3E3D39]/10 last:border-0"
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Logout section */}
          <div className="mt-auto border-t border-border/30">
            {logoutSection.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                onClick={() => {
                  logout();
                  setOpenMenu(false);
                }}
                className={cn(
                  "block w-full bg-mainAccent/50 px-4 py-4 text-base font-medium text-white"
                )}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </Drawer>
    </nav>
  );
};

export default MobileNavbar;
