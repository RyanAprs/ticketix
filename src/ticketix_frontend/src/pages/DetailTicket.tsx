import Layout from "@/components/ui/Layout/Layout";
import { useParams } from "react-router-dom";

const DetailTicket = () => {
  const { id } = useParams();

  return (
    <Layout>
      <div>Detail Ticket id: {id}</div>
    </Layout>
  );
};

export default DetailTicket;
