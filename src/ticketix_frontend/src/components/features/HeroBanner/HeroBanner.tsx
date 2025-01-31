import { Link } from "react-router-dom";
import useWindowSize from "@/hooks/useWindowSize";
import { useAuthManager } from "@/store/AuthProvider";
import CustomButton from "@/components/ui/Button/CustomButton";

const HeroBanner = () => {
  const { login, isAuthenticated } = useAuthManager();
  const { isMobile } = useWindowSize();

  return (
    <div className="flex w-full justify-center border-b">
      <section className="relative font-jetbrainsMono w-full max-w-[1280px] px-4 pb-8 sm:pb-12 md:pb-36 md:pt-10">
        <p className="mb-4 text-center text-sm font-medium text-subtext md:mb-5 md:text-xl">
          Trusted and Transparent Ticket Transactions
        </p>
        <div className="flex flex-col items-center text-center text-4xl font-semibold xs:text-5xl md:text-7xl">
          <div className="flex items-center gap-3 md:gap-5">
            <h1>Take Control of Your </h1>
            {/* <img
              src="/images/logo/ticketix.svg"
              alt="ticketix"
              className="w-[60px] sm:w-[75px] md:w-[110px]"
            /> */}
            {/* <h1>your</h1> */}
          </div>
          <h1>Event Journey</h1>
        </div>

        <div className="mt-5 flex items-center justify-center gap-6 md:mt-9 md:gap-10">
          {!isAuthenticated && (
            <CustomButton
              size={isMobile ? "small" : "default"}
              className="md:w-[250px]"
              onClick={login}
            >
              Join Now
            </CustomButton>
          )}

          {isAuthenticated && (
            <Link to="/dashboard/ticket">
              <CustomButton
                size={isMobile ? "small" : "default"}
                className="md:w-[250px]"
              >
                My Ticket
              </CustomButton>
            </Link>
          )}

          <Link to="/event">
            <CustomButton
              size={isMobile ? "small" : "default"}
              variant={"secondary"}
              className="md:w-[250px]"
            >
              Explore Event
            </CustomButton>
          </Link>
        </div>

        {/* FLOATING ICONS */}
        {/* <img
          src="/images/star-left.svg"
          alt="star"
          className="absolute left-12 top-6 hidden w-20 justify-center md:flex lg:left-24 lg:top-10"
        />
        <img
          src="/images/hexagon-left.svg"
          alt="star"
          className="absolute bottom-10 left-24 hidden w-20 justify-center md:flex lg:bottom-10 lg:left-48"
        />
        <img
          src="/images/hexagon-right.svg"
          alt="star"
          className="absolute right-12 top-6 hidden w-20 justify-center md:flex lg:right-28 lg:top-10"
        />
        <img
          src="/images/star-right.svg"
          alt="star"
          className="absolute bottom-10 right-24 hidden w-20 justify-center md:flex lg:bottom-10 lg:right-48"
        /> */}
      </section>
    </div>
  );
};

export default HeroBanner;
