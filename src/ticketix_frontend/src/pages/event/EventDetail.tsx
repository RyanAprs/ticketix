import EventDetailPreview from "@/components/features/EventManagement/EventDetailPreview";
import IsLoadingPage from "@/components/features/isLoadingPage/IsLoadingPage";
import Layout from "@/components/ui/Layout/Layout";
import { fetchDetailEvent } from "@/lib/services/EventService";
import { getUserById } from "@/lib/services/UserService";
import { formatNSToDate, getEventStatus } from "@/lib/utils";
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
  eventDate: string;
  total: number;
  status: string;
  location: string;
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
          const res = await fetchDetailEvent(actor, id);

          if (res) {
            const creator = res.creator.toString();
            localStorage.setItem("creatorEvent", creator);

            const user = await getUserById(actor, res.creator);
            const eventDate = Number(res.eventDate);
            const formattedDate = formatNSToDate(BigInt(eventDate * 1_000_000));

            const statusEvent = getEventStatus(res.eventDate);

            if (user) {
              const ticket = res.ticket.map((ticket: any) => ({
                id: ticket.id,
                owner: ticket.singleOwner,
                status: ticket.status,
                price: Number(ticket.price),
              }));

              const ticketWithOwnerAsString: EventDetailType = {
                id: res.id,
                title: res.title,
                description: res.description,
                imageUrl: res.imageUrl,
                owner: user.username,
                eventDate: formattedDate,
                total: Number(res.total),
                status: statusEvent,
                location: res.location,
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
          eventDate={ticket.eventDate}
          total={ticket.total}
          status={ticket.status}
          owner={ticket.owner}
          ticket={ticket.ticket}
          location={ticket.location}
        />
      )}
    </Layout>
  );
};

export default EventDetail;
