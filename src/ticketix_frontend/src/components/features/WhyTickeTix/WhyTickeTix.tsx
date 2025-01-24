import React, { ReactNode } from "react";

import { CircleCheck, Crown, Earth, Shield, Users } from "lucide-react";

const WhyTickeTix = () => {
  return (
    <div className="my-10 mt-6 flex w-full justify-center md:mt-10">
      <section className="w-full max-w-[1280px] px-4 py-7 md:py-12">
        <h1 className="mb-6 text-center text-2xl font-bold text-title md:mb-12 lg:text-3xl">
          Why Choose TickeTix?
        </h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Shield className="h-16 w-16 text-pink-400" />}
            title="Secure Blockchain Technology"
            description="Built on the Internet Computer Protocol (ICP) for unparalleled security and transparency."
          />
          <FeatureCard
            icon={<Users className="h-16 w-16 text-pink-400" />}
            title="Direct Peer-to-Peer Transactions"
            description="Say goodbye to middlemen! Buy and sell tickets directly with other users for fair and transparent pricing."
          />
          <FeatureCard
            icon={<CircleCheck className="h-16 w-16 text-pink-400" />}
            title="Fraud Prevention"
            description="With NFT-backed tickets, counterfeit tickets are a thing of the past. Each ticket is unique and verified on the blockchain."
          />
          <FeatureCard
            icon={<Earth className="h-16 w-16 text-pink-400" />}
            title="Global Accessibility"
            description="Access events worldwide and manage your tickets seamlessly through one platform."
          />
          <FeatureCard
            icon={<Crown className="h-16 w-16 text-pink-400" />}
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
    <div className="rounded-lg border bg-mainAccent/20 p-6 shadow-custom">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-title">{title}</h3>
      <p className="font-medium text-subtext">{description}</p>
    </div>
  );
}

export default WhyTickeTix;
