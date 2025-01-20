import { useState } from "react";
import { ticketix_backend } from "../../../declarations/ticketix_backend";
import Layout from "../components/ui/Layout/Layout";
import { Button } from "@/components/ui/Button/button";

const LandingPage = () => {
  const [text, setText] = useState("");

  const handleGreet = async () => {
    const result = await ticketix_backend.greet("TickeTix");
    setText(result);
  };

  return (
    <Layout fullWidth className="px-0">
      <div>LANDING PAGE</div>
      <div className="text-3xl" onClick={handleGreet}>
        <Button type="button" variant="default">
          Click me!
        </Button>

        <span className="ms-4 text-red-400">{text}</span>
      </div>
    </Layout>
  );
};

export default LandingPage;
