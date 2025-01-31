import EventDetailPreview from "@/components/features/EventManagement/EventDetailPreview";
import IsLoadingPage from "@/components/features/isLoadingPage/IsLoadingPage";
import Layout from "@/components/ui/Layout/Layout";
import { fetchDetailTicket } from "@/lib/services/TicketService";
import { getUserById } from "@/lib/services/UserService";
import { formatNSToDate } from "@/lib/utils";
import { useAuthManager } from "@/store/AuthProvider";
import { TicketStatusInterface } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface EventDetailType {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  owner: string;
  salesDeadline: string;
  total: number;
  ticket: {
    id: string;
    owner: string;
    status: TicketStatusInterface;
    price: number;
  }[];
}

const EventDetail = () => {
  const { id } = useParams();
  const { actor, principal } = useAuthManager();
  const [ticket, setTicket] = useState<EventDetailType | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  let idTicket;

  if (id) {
    idTicket = id.toString() || "";
  }

  useEffect(() => {
    const fetchData = async () => {
      if (actor && id) {
        try {
          setLoading(true);
          const res = await fetchDetailTicket(actor, id);
          if (res) {
            const user = await getUserById(actor, res.creator);
            const salesDeadline = Number(res.salesDeadline);
            const formattedDate = formatNSToDate(
              BigInt(salesDeadline * 1_000_000)
            );

            if (user) {
              const ticket = res.ticket.map((ticket: any) => ({
                id: ticket.id,
                owner: ticket.singleOwner,
                status: ticket.status,
                price: ticket.price,
              }));

              const ticketWithOwnerAsString: EventDetailType = {
                id: res.id,
                title: res.title,
                description: res.description,
                imageUrl: res.imageUrl,
                owner: user.username,
                salesDeadline: formattedDate,
                total: Number(res.total),
                ticket,
              };

              setTicket(ticketWithOwnerAsString);
            }
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [actor, id, principal]);

  return (
    <Layout>
      {!ticket || loading ? (
        <IsLoadingPage />
      ) : (
        <EventDetailPreview
          id={idTicket ?? ""}
          title={ticket.title}
          description={ticket.description}
          imageUrl={ticket.imageUrl}
          salesDeadline={ticket.salesDeadline}
          total={ticket.total}
          owner={ticket.owner}
          ticket={ticket.ticket}
        />
      )}
    </Layout>
  );
};

export default EventDetail;
