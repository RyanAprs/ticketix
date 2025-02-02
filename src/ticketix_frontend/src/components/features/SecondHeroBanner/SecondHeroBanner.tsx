const items = [
  {
    title: "BlockChain",
  },
  {
    title: "BlockChain",
  },
  {
    title: "BlockChain",
  },
];

const SecondHeroBanner = () => {
  return (
    <div className="min-h-[340px] bg-white flex justify-evenly items-center px-3 py-14">
      <div>
        <img src="/images/image/iPhone16Pro.png" alt="iPhone16Pro" />
      </div>
      <div className=" flex flex-col justify-center items-start gap-4">
        <div className="text-[48px] font-semibold flex justify-center items-center">
          <h1 className="text-black flex justify-center items-center w-full">
            Your Partner <span className="text-blue-500">Ticket </span> Journey
          </h1>
        </div>
        <div className="text-black font-medium text-[18px]">
          <h2>Trusted and Trasparent Ticket Transactions</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-4 lg:bg-blue-100 bg-white rounded-full">
          {items.map((item, index) => {
            return (
              <div
                key={index}
                className="flex gap-2 p-3 rounded-full lg:bg-white bg-blue-100 justify-center items-center"
              >
                <img src="/images/logo/LogoTicketix2.svg" alt="ticketix logo" />
                <p className="text-blue-600 font-medium text-[16px]">
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SecondHeroBanner;
