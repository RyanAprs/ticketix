import IsLoadingPage from "@/components/features/isLoadingPage/IsLoadingPage";
import TicketDetailPreview from "@/components/features/TicketManagement/TicketDetailPreview";
import Layout from "@/components/ui/Layout/Layout";
import { fetchDetailTicket } from "@/lib/services/TicketService";
import { getUserById } from "@/lib/services/UserService";
import { formatNSToDate } from "@/lib/utils";
import { useAuthManager } from "@/store/AuthProvider";
import { TicketStatus } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface SingleTicketType {
  id: string;
  owner: string;
  status: TicketStatus;
}

interface TicketType {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  owner: string;
  salesDeadline: string;
  total: number;
  singleTicket: SingleTicketType[];
}

const TicketDetail = () => {
  const { id } = useParams();
  const { actor, principal } = useAuthManager();
  const [ticket, setTicket] = useState<TicketType | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (actor && id) {
        try {
          setLoading(true);
          const res = await fetchDetailTicket(actor, id);
          if (res) {
            const user = await getUserById(actor, res.owner);
            const salesDeadline = Number(res.salesDeadline);
            const formattedDate = formatNSToDate(
              BigInt(salesDeadline * 1_000_000)
            );

            if (user) {
              const singleTicketsWithOwner = res.singleTicket.map(
                (ticket: any) => ({
                  ...ticket,
                  owner: res.owner,
                })
              );

              const ticketWithOwnerAsString = {
                ...res,
                owner: user.username,
                salesDeadline: formattedDate,
                total: Number(res.total),
                singleTicket: singleTicketsWithOwner,
              };

              console.log(ticketWithOwnerAsString);
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
        <TicketDetailPreview
          title={ticket.title}
          description={ticket.description}
          imageUrl={ticket.imageUrl}
          price={ticket.price}
          salesDeadline={ticket.salesDeadline}
          total={ticket.total}
          owner={ticket.owner}
          singleTicket={ticket.singleTicket}
        />
      )}
    </Layout>
  );
};

export default TicketDetail;
