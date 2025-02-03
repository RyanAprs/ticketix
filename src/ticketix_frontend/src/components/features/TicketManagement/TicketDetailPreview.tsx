import { useParams } from "react-router-dom";

const TicketDetailPreview = () => {
  const { id } = useParams();
  return <div className="mt-20">{id}</div>;
};

export default TicketDetailPreview;
