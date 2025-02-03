import { Link } from "react-router-dom";
import { useAuthManager } from "@/store/AuthProvider";
import { Button } from "@/components/ui/Button/button";

const HeroBanner = () => {
  const { login, isAuthenticated } = useAuthManager();

  return (
    <div className="flex w-full justify-center items-center bg-gradient-to-b from-blue-300 to-blue-600 min-h-[400px] md:h-[617px] text-white rounded-xl md:px-4 sm:px-1 px-0">
      <section className="relative font-jetbrainsMono w-full max-w-[1248px] py-12 md:py-16 lg:py-20">
        {/* Subheading */}
        <p className="mb-4 text-center text-xs sm:text-sm md:text-xl font-medium md:mb-5 px-2">
          Trusted and Transparent Ticket Transactions
        </p>

        {/* Main Heading */}
        <div className="flex flex-col items-center text-center text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold">
          <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-3 lg:gap-5 px-4">
            <h1>Take Control of Your</h1>
          </div>
          <h1 className="mt-2 sm:mt-0">Event Journey</h1>
        </div>

        {/* Buttons */}
        <div className="w-full mt-8 md:mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-10 px-4">
          {!isAuthenticated && (
            <Button
              size="lg"
              className="w-1/2 sm:w-auto bg-blue-400 rounded-lg shadow-lg border-x border-t border-blue-100"
              onClick={login}
            >
              Join Now
            </Button>
          )}

          {isAuthenticated && (
            <Link
              to="/dashboard/ticket"
              className="w-full flex items-center justify-center sm:w-auto"
            >
              <Button
                size="lg"
                className="w-1/2 sm:w-auto bg-blue-400 rounded-lg shadow-lg border-x border-t border-blue-100"
              >
                My Ticket
              </Button>
            </Link>
          )}

          <Link
            to="/event"
            className="w-full flex items-center justify-center sm:w-auto"
          >
            <Button
              size="lg"
              className="w-1/2 sm:w-auto bg-blue-600 rounded-lg shadow-lg border-x border-t border-blue-100"
            >
              Explore Event
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HeroBanner;
