import Accordion from "@/components/ui/Accordion/accordion";

const FAQ = () => {
  const accordionItems = [
    {
      title: "What is TickeTix?",
      content: (
        <p>
          NekoTip is a blockchain-based donation platform built on the Internet
          Computer Protocol (ICP). It platform for buying and selling event
          tickets securely. It uses NFT technology to ensure authenticity and
          prevent fraud.
        </p>
      ),
    },
    {
      title: "What makes TickeTix unique?",
      content: (
        <p>
          TickeTix stands out by combining the power of blockchain and NFTs to
          provide a secure, transparent, and tamper-proof ticketing experience.
          Unlike traditional ticket platforms, we eliminate the risk of
          counterfeit tickets and fraud, while enabling direct peer-to-peer
          transactions. With full control over ticket buying, selling, and
          transfer, TickeTix empowers users and event organizers alike to have a
          seamless, trustworthy ticketing experience worldwide.
        </p>
      ),
    },
    {
      title: "How do I buy and shell tickets?",
      content: (
        <p>
          Simply create an account, browse events, and purchase tickets using
          blockchain-secured transactions. Your tickets will be sent to your
          wallet as unique NFTs. After purchasing tickets, you can list them for
          resale directly on the platform. Set your price, and once a buyer is
          found, the transaction is completed securely via blockchain.
        </p>
      ),
    },
    {
      title: "What are NFT tickets?",
      content: (
        <p>
          NFT tickets are digital tickets stored on the blockchain. They are
          unique, verifiable, and tamper-proof, ensuring authenticity and
          preventing counterfeiting.
        </p>
      ),
    },
    {
      title: "Is TickeTix secure?",
      content: (
        <p>
          Yes, TickeTix uses Internet Identity for secure logins and blockchain
          technology to provide secure, transparent, and tamper-proof ticket
          transactions, ensuring your tickets and personal data are protected.
        </p>
      ),
    },
    {
      title: "Can I use TickeTix globally?",
      content: (
        <p>
          Yes, TickeTix is accessible worldwide, allowing you to buy, sell, and
          manage tickets for events around the globe.
        </p>
      ),
    },
    {
      title: "What happens if I lose my NFT ticket?",
      content: (
        <p>
          Since your NFT ticket is stored in your wallet, you won’t lose access
          to it. Just ensure your wallet is secure and backed up.
        </p>
      ),
    },
    {
      title: "How do I access my event with an NFT ticket?",
      content: (
        <p>
          On the event day, simply show your NFT ticket from your wallet at the
          venue for seamless entry.
        </p>
      ),
    },
  ];

  return (
    <div className="flex w-full justify-center">
      <section className="w-full max-w-[1280px] px-4 py-7 md:py-12">
        <div className="mx-auto w-full max-w-[720px]">
          <h1 className="mb-6 text-xl font-bold text-subtext lg:text-2xl">
            Frequently Asked Questions (FAQ)
          </h1>
          <Accordion items={accordionItems} />
        </div>
      </section>
    </div>
  );
};

export default FAQ;
