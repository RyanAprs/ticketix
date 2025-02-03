import { Key, Lock, TicketCheck } from "lucide-react";

const items = [
  {
    icon: <Lock />,
    title: "BlockChain",
  },
  {
    icon: <Key />,
    title: "ICP Ecosystem",
  },
  {
    icon: <TicketCheck />,
    title: "NFT",
  },
];

const SecondHeroBanner = () => {
  return (
    <div className="min-h-[340px] bg-white px-4 py-8 lg:py-14">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row justify-evenly items-center gap-8">
        <div className="w-full lg:w-auto flex justify-center">
          <img
            src="/images/image/iPhone16Pro.png"
            alt="iPhone16Pro"
            className="max-w-[280px] lg:max-w-full w-auto h-auto"
          />
        </div>

        <div className="flex flex-col justify-center items-center lg:items-start gap-4 text-center lg:text-left">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold text-black">
            Your Partner <span className="text-blue-500">Ticket</span> Journey
          </h1>

          <h2 className="text-black font-medium text-base md:text-lg">
            Trusted and Trasparent Ticket Transactions
          </h2>

          <div className="w-auto">
            <div className="flex items-center justify-center gap-3 p-3 lg:bg-blue-100 bg-white rounded-full">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex  p-2 md:p-3 rounded-full lg:bg-white bg-blue-100 justify-center gap-4 items-center"
                >
                  <p className="p-2 bg-blue-600 rounded-full text-white">
                    {item.icon}
                  </p>
                  <p className="text-blue-600 font-medium text-xl md:text-base whitespace-nowrap">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondHeroBanner;
