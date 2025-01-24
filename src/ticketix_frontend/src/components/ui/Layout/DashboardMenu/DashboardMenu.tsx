import { Link, useLocation } from "react-router-dom";
import { menuSections } from "../Navbar/UseDropDown";
import { useAuthManager } from "@/store/AuthProvider";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import CustomButton from "../../Button/CustomButton";

const DashboardMenu = () => {
  const { pathname } = useLocation();
  const { logout } = useAuthManager();

  const [history, setHistory] = useState(
    localStorage.getItem("lastpath") || pathname
  );

  useEffect(() => {
    if (pathname && pathname !== "dashboard/sellticket/post") {
      setHistory(pathname);
      localStorage.setItem("lastpath", pathname);
    }
  }, [pathname]);

  const dashboardMenu = menuSections.map((section) => {
    return {
      ...section,
      items: section.items.filter((item) =>
        ["Profile", "My Tickets"].includes(item.label)
      ),
    };
  });

  return (
    <aside className="h-[calc(100vh-81px)] w-full max-w-[250px] border-r border-border">
      <div className="flex flex-col divide-y divide-border">
        {dashboardMenu.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-1 p-2">
            {section.items.map((item, itemIndex) => (
              <Link
                key={itemIndex}
                to={item.to ?? "#"}
                className={cn(
                  "flex w-full items-center gap-2 rounded-xl px-4 py-3 text-base font-medium text-subtext",
                  item.to === history &&
                    [
                      "bg-mainAccent",
                      "bg-secondaryAccent",
                      "bg-thirdAccent",
                      "bg-mainAccent",
                    ][sectionIndex],
                  section.activeClassName
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-5 border-border px-3 pt-6">
        <CustomButton className="w-full px-0 shadow-none" onClick={logout}>
          Logout
        </CustomButton>
      </div>
    </aside>
  );
};

export default DashboardMenu;
