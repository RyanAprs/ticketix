import React, { ReactNode } from "react";

import { CircleCheck, Crown, Earth, Shield, Users } from "lucide-react";

const WhyTickeTix = () => {
  return (
    <div className="my-10 mt-6 flex w-full justify-center md:mt-10 bg-blue-100 rounded-xl">
      <section className="w-full max-w-[1280px] px-4 py-7 md:py-12">
        <h1 className="mb-6 text-center text-2xl font-bold text-title md:mb-12 lg:text-3xl">
          Why Choose TickeTix?
        </h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-white" />}
            title="Secure Blockchain Technology"
            description="Built on the Internet Computer Protocol (ICP) for unparalleled security and transparency."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-white" />}
            title="Direct Peer-to-Peer Transactions"
            description="Say goodbye to middlemen! Buy and sell tickets directly with other users for fair and transparent pricing."
          />
          <FeatureCard
            icon={<CircleCheck className="h-8 w-8 text-white" />}
            title="Fraud Prevention"
            description="With NFT-backed tickets, counterfeit tickets are a thing of the past. Each ticket is unique and verified on the blockchain."
          />
          <FeatureCard
            icon={<Earth className="h-8 w-8 text-white" />}
            title="Global Accessibility"
            description="Access events worldwide and manage your tickets seamlessly through one platform."
          />
          <FeatureCard
            icon={<Crown className="h-8 w-8 text-white" />}
            title="Empowering Event Organizers"
            description="Event creators gain full control over ticket distribution, resale policies, and fan engagement."
          />
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-xl  bg-white border border-blue-400 p-6 shadow-xl">
      <div className="mb-4 flex p-2 bg-blue-100 rounded-xl gap-2 justify-center items-center">
        <div className="p-2 bg-blue-600 rounded-full">{icon}</div>
        <h3 className="mb-2 text-xl font-semibold text-title">{title}</h3>
      </div>

      <div>
        <p className="font-medium text-subtext">{description}</p>
      </div>
    </div>
  );
}

export default WhyTickeTix;
