import IsLoadingPage from "@/components/features/isLoadingPage/IsLoadingPage";
import TicketEventPreview from "@/components/features/TicketManagement/TicketEventPreview";
import CustomButton from "@/components/ui/Button/CustomButton";
import Layout from "@/components/ui/Layout/Layout";
import { getUserById } from "@/lib/services/UserService";
import { useAuthManager } from "@/store/AuthProvider";
import { TicketType } from "@/types";
import { Principal } from "@dfinity/principal";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type Result<T> = { ok?: T; err?: string };

export interface EnhancedTicketType extends TicketType {
  totalTickets: number;
  ownerUsername: string;
}

const TicketPage = () => {
  const { id } = useParams();
  const { actor } = useAuthManager();
  const [tickets, setTickets] = useState<EnhancedTicketType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const idTicket = id ?? "";

  useEffect(() => {
    if (!actor) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = (await actor.getAllForSaleTicketByEvent(
          idTicket
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

    fetchData();
  }, [actor, idTicket]);

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col gap-4">
          <Link to={`/event/${idTicket}`} className="w-3/4">
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
      {isLoading ? (
        <IsLoadingPage />
      ) : (
        <div className="flex flex-col gap-4">
          <Link to={`/event/${idTicket}`} className="w-3/4">
            <CustomButton className="flex justify-center items-center gap-2">
              <ArrowLeft />
              Back
            </CustomButton>
          </Link>
          <TicketEventPreview tickets={tickets} />
        </div>
      )}
    </Layout>
  );
};

export default TicketPage;
