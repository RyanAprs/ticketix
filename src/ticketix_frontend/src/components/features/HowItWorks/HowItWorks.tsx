const HowItWorks = () => {
  return (
    <section className=" flex md:flex-col flex-col-reverse gap-6 justify-center items-center">
      <div>
        <img src="/images/image/MusicFestival.png" alt="MusicFestival" />
      </div>
      <div className="container mx-auto px-4">
        <h1 className="mb-6 text-center text-2xl font-semibold text-black md:mb-12 lg:text-3xl">
          How TickeTix Works
        </h1>
        <div className="grid grid-cols-1 gap-4 text-subtext md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-mainAccent">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Sign Up</h3>
            <p className="font-light">
              Create your account using Internet Identity for secure, seamless
              access.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-mainAccent">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Buy & Sell Tickets</h3>
            <p className="font-light">
              Easily buy tickets or list your extra tickets for resale with
              blockchain-secured transactions.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-mainAccent">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Access Your Event</h3>
            <p className="font-light">
              Simply show your ticket at the event, and enjoy the seamless,
              fraud-free experience powered by blockchain technology.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
