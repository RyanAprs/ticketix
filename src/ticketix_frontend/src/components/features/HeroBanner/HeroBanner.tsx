import { Link } from "react-router-dom";
import { useAuthManager } from "@/store/AuthProvider";
import { Button } from "@/components/ui/Button/button";

const HeroBanner = () => {
  const { login, isAuthenticated } = useAuthManager();

  return (
    <div className="flex w-full justify-center items-center bg-gradient-to-b from-blue-300 to-blue-600 t h-[617px] text-white rounded-xl">
      <section className="relative font-jetbrainsMono w-full max-w-[1248px] px-4 pb-8 sm:pb-12 md:pb-36 md:pt-10 mt-16">
        <p className="mb-4 text-center text-sm font-medium md:mb-5 md:text-xl">
          Trusted and Transparent Ticket Transactions
        </p>
        <div className="flex flex-col items-center text-center text-4xl font-semibold xs:text-5xl md:text-7xl">
          <div className="flex items-center gap-3 md:gap-5">
            <h1>Take Control of Your </h1>
          </div>
          <h1>Event Journey</h1>
        </div>

        <div className="mt-5 flex items-center justify-center gap-6 md:mt-9 md:gap-10">
          {!isAuthenticated && (
            <Button
              size="lg"
              className="bg-blue-400 rounded-lg shadow-lg border-x border-t border-blue-100"
              onClick={login}
            >
              Join Now
            </Button>
          )}

          {isAuthenticated && (
            <Link to="/dashboard/ticket">
              <Button
                size="lg"
                className="bg-blue-400 rounded-lg shadow-lg border-x border-t border-blue-100"
              >
                My Ticket
              </Button>
            </Link>
          )}

          <Link to="/event">
            <Button
              size="lg"
              className="bg-blue-600 rounded-lg shadow-lg border-x border-t border-blue-100"
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
