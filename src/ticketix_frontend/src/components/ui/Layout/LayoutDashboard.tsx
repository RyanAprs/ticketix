import useWindowSize from "@/hooks/useWindowSize";
import { LayoutProps } from "./types";
import MobileNavbar from "./Navbar/MobileNavbar";
import Navbar from "./Navbar/Navbar";
import { cn } from "@/lib/utils/cn";
import DashboardMenu from "./DashboardMenu/DashboardMenu";

const LayoutDashboard = ({ children, className, title }: LayoutProps) => {
  const { isTablet } = useWindowSize();

  let pageTitle: string = "TickeTix";

  if (title) {
    pageTitle = title + " - TickeTix";
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      {isTablet ? <MobileNavbar /> : <Navbar />}

      <div className="flex flex-1 w-full">
        {!isTablet && <DashboardMenu />}
        <main
          className={cn(
            "flex-1 w-full md:p-4 p-1 font-jetbrainsMono",
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutDashboard;
