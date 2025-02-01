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
    <div className="min-h-[340px] bg-white flex flex-col justify-center items-center gap-6">
      <div className="text-[48px] font-semibold flex justify-center items-center">
        <h1 className="text-black flex flex-col justify-center items-center w-full">
          <span>Your Partner</span>
          <span className="-mt-5">
            <span className="text-blue-500">Ticket </span>
            Jurney
          </span>
        </h1>
      </div>
      <div className="text-black font-medium text-[18px]">
        <h2>Trusted and Trasparent Ticket Transactions</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          return (
            <div
              key={index}
              className="flex gap-2 p-2 rounded-full bg-blue-100 justify-center items-center"
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
  );
};

export default SecondHeroBanner;
