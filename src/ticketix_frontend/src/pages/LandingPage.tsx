import Layout from "../components/ui/Layout/Layout";
import HeroBanner from "@/components/features/HeroBanner/HeroBanner";
import WhyTickeTix from "@/components/features/WhyTickeTix/WhyTickeTix";
import HowItWorks from "@/components/features/HowItWorks/HowItWorks";
import FAQ from "@/components/features/FAQ/FAQ";

const LandingPage = () => {
  return (
    <Layout fullWidth className="px-0 font-jetbrainsMono">
      <HeroBanner />
      <WhyTickeTix />
      <HowItWorks />
      <FAQ />
    </Layout>
  );
};

export default LandingPage;
