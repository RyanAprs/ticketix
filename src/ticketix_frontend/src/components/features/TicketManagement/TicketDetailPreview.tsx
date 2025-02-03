import { useParams } from "react-router-dom";
import TicketQRCode from "../QRCode/TicketQRCode";
import { ChevronLeft, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthManager } from "@/store/AuthProvider";
import { getTicketById } from "@/lib/services/TicketService";
import IsLoadingPage from "../isLoadingPage/IsLoadingPage";

interface TicketDetail {
  id: string;
  eventId: string;
  owner: string;
}

const TicketDetailPreview = () => {
  const { id } = useParams();
  const { actor } = useAuthManager();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (actor && id) {
          const res = await getTicketById(actor, id);

          if (res) {
            const data: TicketDetail = {
              id: res.id,
              eventId: res.eventId,
              owner: res.owner.toString(),
            };
            setTicket(data);
          }
        }
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, actor]);

  if (isLoading) {
    return <IsLoadingPage />;
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">No ticket found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br  p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-blue-600 text-white p-4 flex items-center space-x-4">
            <h1 className="text-xl font-semibold flex-grow">Ticket QRCODE</h1>
            <Ticket className="w-6 h-6" />
          </div>

          <TicketQRCode
            ticketId={ticket.id}
            eventId={ticket.eventId}
            owner={ticket.owner}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPreview;
