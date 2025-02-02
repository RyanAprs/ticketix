import { useAuthManager } from "@/store/AuthProvider";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils/cn";
import UserDropdown from "./UseDropDown";
import { Button } from "../../Button/button";

const Navbar = () => {
  const { isAuthenticated, login } = useAuthManager();
  return (
    <nav className="flex w-full justify-center bg-transparent z-50 font-jetbrainsMono">
      <div
        className={cn(
          "flex h-[80px] w-full items-center justify-between px-16 pt-6"
        )}
      >
        <div className="flex items-center gap-x-[60px]">
          <Link to={"/"} className="flex gap-2 justify-center items-center">
            <img
              alt="ticketix logo"
              src="/images/logo/LogoTicketix2.svg"
              loading="eager"
              className="w-12"
            ></img>
            <h1 className="text-xl font-semibold text-mainAccent">TickeTix</h1>
          </Link>
        </div>

        <div className="flex gap-7">
          <ul className="flex items-center gap-x-10 font-semibold text-white">
            {isAuthenticated && (
              <li className="hover:text-blue-100">
                <Link to="/dashboard">Dashboard</Link>
              </li>
            )}
            <li className="hover:text-blue-100">
              <Link to="/event">Explore Event</Link>
            </li>
            <li className="cursor-pointer hover:text-blue-100">Support</li>
          </ul>
        </div>

        {!isAuthenticated ? (
          <Button
            className="rounded-full bg-mainAccent"
            onClick={() => login()}
          >
            Login
          </Button>
        ) : (
          <UserDropdown />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
