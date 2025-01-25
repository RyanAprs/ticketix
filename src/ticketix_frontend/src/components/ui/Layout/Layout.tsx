import { Helmet } from "react-helmet";

import Footer from "./Footer/Footer";
import Navbar from "./Navbar/Navbar";
import { cn } from "@/lib/utils";
import { LayoutProps } from "./types";
import useWindowSize from "@/hooks/useWindowSize";
import MobileNavbar from "./Navbar/MobileNavbar";

const Layout = ({ children, className, title, fullWidth }: LayoutProps) => {
  const { isTablet } = useWindowSize();

  let pageTitle: string = "TickeTix";
  if (title) {
    pageTitle = title + " - TickeTix";
  }
  return (
    <>
      <Helmet title={pageTitle}></Helmet>
      <div className="h-full w-full">
        <div
          className={cn(
            "relative mx-auto grid min-h-screen",
            // "auto" is for the main tag
            // add "max-content" to the "grid-rows" class below for each div if want to add more "static" elements
            "grid-rows-[max-content_auto_max-content]"
          )}
        >
          {isTablet ? <MobileNavbar /> : <Navbar />}
          <div className="mb-10 mt-6 flex w-full justify-center lg:mb-14 lg:mt-10">
            <main
              className={cn(
                "w-full px-4",
                !fullWidth && "max-w-[1280px]",
                className
              )}
            >
              {children}
            </main>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;
