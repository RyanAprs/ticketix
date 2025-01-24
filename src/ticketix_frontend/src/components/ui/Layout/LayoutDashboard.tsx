import useWindowSize from "@/hooks/useWindowSize";
import { LayoutProps } from "./types";
import { Helmet } from "react-helmet";
import MobileNavbar from "./Navbar/MobileNavbar";
import Navbar from "./Navbar/Navbar";
import { cn } from "@/lib/utils";
import DashboardMenu from "./DashboardMenu/DashboardMenu";

const LayoutDashboard = ({ children, className, title }: LayoutProps) => {
  const { isTablet } = useWindowSize();

  let pageTitle: string = "TickeTix";

  if (title) {
    pageTitle = title + " - TickeTix";
  }
  return (
    // <Helmet title={pageTitle}>
    <div className="h-full w-full">
      {isTablet ? <MobileNavbar /> : <Navbar />}
      <div className={cn("flex h-full w-full")}>
        {!isTablet && <DashboardMenu />}
        <main className={cn("mb-4 p-4 lg:p-7", className)}>{children}</main>
      </div>
    </div>
    // </Helmet>
  );
};

export default LayoutDashboard;
