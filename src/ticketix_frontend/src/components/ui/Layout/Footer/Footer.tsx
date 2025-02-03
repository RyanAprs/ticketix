import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "About Us", to: "#" },
        { name: "Explore Events", to: "/event" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", to: "#" },
        { name: "Privacy Policy", to: "#" },
        { name: "Cookie Policy", to: "#" },
      ],
    },
    {
      title: "Connect",
      links: [
        { name: "Twitter", to: "#" },
        { name: "Facebook", to: "#" },
        { name: "Instagram", to: "#" },
        { name: "Telegram", to: "#" },
      ],
    },
  ];

  return (
    <footer className="w-full border-t bg-blue-100 py-8 font-medium text-subtext font-jetbrainsMono">
      <section className="flex flex-col gap-6 px-4 md:gap-14 xl:flex-row xl:justify-center xl:gap-20">
        <div className="w-[350px] flex flex-col gap-4">
          <Link to={"/"} className="flex gap-2 items-center">
            <img
              alt="ticketix logo"
              src="/images/logo/LogoTicketix2.svg"
              loading="eager"
              className="w-12"
            ></img>
            <h1 className="text-xl font-semibold text-mainAccent">TickeTix</h1>
          </Link>
          <p className="max-w-[350px] font-medium">
            Ticket Transactions through secure blockchain technology.
          </p>
        </div>

        <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
          {footerLinks.map((footer) => (
            <div key={footer.title} className="grid w-[300px] xl:justify-end">
              <h3 className="mb-2 text-lg font-semibold text-title">
                {footer.title}
              </h3>
              <ul className="space-y-1 font-medium text-caption">
                {footer.links.map((item) => (
                  <li key={item.name}>
                    <Link to={item.to} className="hover:text-title">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 border-t pt-8 text-center">
        <p>&copy;2025 TickeTix. All rights reserved.</p>
      </section>
    </footer>
  );
};

export default Footer;
