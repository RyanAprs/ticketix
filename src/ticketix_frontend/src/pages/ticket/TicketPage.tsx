import IsLoadingPage from "@/components/features/isLoadingPage/IsLoadingPage";
import TicketEventPreview from "@/components/features/TicketManagement/TicketEventPreview";
import CustomButton from "@/components/ui/Button/CustomButton";
import Layout from "@/components/ui/Layout/Layout";
import { getTicketByOwnerOwnedStatus } from "@/lib/services/TicketService";
import { getUserById } from "@/lib/services/UserService";
import { useAuthManager } from "@/store/AuthProvider";
import { TicketType } from "@/types";
import { Principal } from "@dfinity/principal";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Ticket as TicketOwnedType } from "../../../../declarations/ticketix_backend/ticketix_backend.did";
import TicketResellDialog from "@/components/ui/Dialog/TicketResellDialog";

type Result<T> = { ok?: T; err?: string };

export interface EnhancedTicketType extends TicketType {
  totalTickets: number;
  ownerUsername: string;
}

const TicketPage = () => {
  const { id } = useParams();
  const { actor, principal } = useAuthManager();
  const [tickets, setTickets] = useState<EnhancedTicketType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [ticketOwned, setTicketOwned] = useState([] as TicketOwnedType[]);
  const navigate = useNavigate();
  const creator = localStorage.getItem("creatorEvent");

  const handleResellClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const eventId = id ?? "";

  const resellTicket = async (eventId: string, ticketId: string) => {
    if (!actor || !principal) return;

    try {
      const result = await actor.resellTicketsDemo(
        eventId,
        principal,
        ticketId
      );
      if ("ok" in result) {
        alert("Ticket resold successfully!");
        window.location.reload();
      } else {
        throw new Error(result.err || "Failed to resell ticket");
      }
    } catch (error) {
      console.error("Error reselling ticket:", error);
      alert("Failed to resell ticket. Please try again.");
    }
  };

  const onConfirmResell = (eventId: string, ticketId: string) => {
    resellTicket(eventId, ticketId);
    handleCloseDialog();
  };

  useEffect(() => {
    if (!actor) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = (await actor.getAllForSaleTicketByEvent(
          eventId
        )) as Result<TicketType[]>;

        if (!result.ok) {
          throw new Error(result.err || "Invalid result from API");
        }

        const owners = [
          ...new Set(
            result.ok.map((ticket: TicketType) => ticket.owner.toString())
          ),
        ];

        const users = await Promise.all(
          owners.map(async (owner: string) => {
            try {
              const ownerPrincipal = Principal.fromText(owner);
              const user = await getUserById(actor, ownerPrincipal);

              if (!user) {
                return { owner, username: "Unknown User" };
              }

              return {
                owner,
                username: user.username || "No Username",
              };
            } catch (error) {
              console.error(`Error fetching user for owner ${owner}:`, error);
              return { owner, username: "Error" };
            }
          })
        );

        const userMap = users.reduce((acc, { owner, username }) => {
          return {
            ...acc,
            [owner]: username,
          };
        }, {} as Record<string, string>);

        const ticketGroups = result.ok.reduce(
          (acc: Record<string, TicketType[]>, ticket: TicketType) => {
            const ownerKey = ticket.owner.toString();
            if (!acc[ownerKey]) acc[ownerKey] = [];
            acc[ownerKey].push(ticket);
            return acc;
          },
          {}
        );

        const enhancedTickets = Object.entries(ticketGroups).map(
          ([owner, group]: [string, TicketType[]]) => ({
            ...group[0],
            totalTickets: group.length,
            ownerUsername: userMap[owner] || "Unknown",
            principal: Principal.fromText(owner),
          })
        );

        setTickets(enhancedTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (actor && principal) {
      const fetchOwnedTicket = async () => {
        try {
          setIsLoading(true);
          const result = await getTicketByOwnerOwnedStatus(actor, principal);

          if (result) {
            setTicketOwned(result);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOwnedTicket();
    }

    fetchData();
  }, [actor, eventId]);

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col gap-4">
          <Link to={`/event/${eventId}`} className="w-3/4">
            <CustomButton className="flex justify-center items-center gap-2">
              <ArrowLeft />
              Back
            </CustomButton>
          </Link>
          <div className="text-red-500">Error: {error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-4 mt-20">
        <div className="flex justify-between items-center">
          <Link to={`/event/${eventId}`} className="w-3/4">
            <CustomButton className="flex justify-center items-center gap-2 text-white">
              <ArrowLeft />
              Back
            </CustomButton>
          </Link>
          {creator === principal?.toString() ? (
            <CustomButton
              className="text-white"
              onClick={() => navigate("/dashboard/event")}
            >
              Manage Event
            </CustomButton>
          ) : (
            <CustomButton className="text-white" onClick={handleResellClick}>
              Resale Ticket
            </CustomButton>
          )}
        </div>
        {isLoading ? (
          <IsLoadingPage />
        ) : (
          <TicketEventPreview tickets={tickets} />
        )}
      </div>

      <TicketResellDialog
        onConfirmResell={onConfirmResell}
        ticketOwned={ticketOwned}
        onOpenChange={setIsDialogOpen}
        open={isDialogOpen}
      />
    </Layout>
  );
};

export default TicketPage;
