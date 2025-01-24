import { useAuthManager } from "@/store/AuthProvider";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import UserDropdown from "./UseDropDown";
import CustomButton from "../../Button/CustomButton";

const Navbar = () => {
  const { isAuthenticated, login } = useAuthManager();
  return (
    <nav className="flex w-full justify-center border-b">
      <div
        className={cn("flex h-[80px] w-full items-center justify-between px-6")}
      >
        <div className="flex items-center gap-x-[60px]">
          <Link to={"/"}>
            {/* <img
              alt="ticketix logo"
              src=""
              loading="eager"
            ></img> */}
            TickeTix
          </Link>
          <ul className="flex items-center gap-x-10 font-semibold text-subtext">
            {isAuthenticated && (
              <li className="hover:text-black">
                <Link to="/dashboard">Dashboard</Link>
              </li>
            )}
            <li className="hover:text-black">
              <Link to="/">Browse Tickets</Link>
            </li>
            <li className="cursor-pointer hover:text-black">Support</li>
          </ul>
        </div>

        {!isAuthenticated ? (
          <CustomButton onClick={() => login()}>Login</CustomButton>
        ) : (
          <UserDropdown />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
