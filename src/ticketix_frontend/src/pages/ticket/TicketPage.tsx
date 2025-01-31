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
        const result = await actor.getAllForSaleTicketByEvent(idTicket);
        console.log("Raw ticket result:", result);

        if (!result || !result.ok) {
          throw new Error("Invalid result from API");
        }

        const owners = [
          ...new Set(
            result.ok.map((ticket: TicketType) => ticket.owner.toString())
          ),
        ];
        console.log("Unique owners:", owners);

        const users = await Promise.all(
          owners.map(async (owner) => {
            try {
              const ownerPrincipal =
                typeof owner === "string" ? Principal.fromText(owner) : owner;

              const user = await getUserById(actor, ownerPrincipal);
              console.log("Fetched user for owner:", {
                owner: owner.toString(),
                user,
                username: user?.username,
              });

              if (!user) {
                return { owner: owner.toString(), username: "Unknown User" };
              }

              return {
                owner: owner.toString(),
                username: user.username || "No Username",
              };
            } catch (error) {
              console.error(`Error fetching user for owner ${owner}:`, error);
              return { owner: owner.toString(), username: "Error" };
            }
          })
        );

        const userMap = users.reduce((acc, { owner, username }) => {
          return {
            ...acc,
            [owner]: username,
          };
        }, {} as Record<string, string>);

        console.log("Final userMap:", userMap);

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
          ([owner, group]) => ({
            ...group[0],
            totalTickets: group.length,
            ownerUsername: userMap[owner] || "Unknown",
          })
        );

        setTickets(enhancedTickets);
        console.log("Final processed tickets:", enhancedTickets);
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

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col gap-4">
          <Link to={`/event/${idTicket}`} className="w-3/4">
            <CustomButton className="flex justify-center items-center gap-2">
              <ArrowLeft />
              Back
            </CustomButton>
          </Link>
          <div>Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <Link to={`/event/${idTicket}`} className="w-3/4">
          <CustomButton className="flex justify-center items-center gap-2">
            <ArrowLeft />
            Back
          </CustomButton>
        </Link>
        <TicketEventPreview tickets={tickets} />
      </div>
    </Layout>
  );
};

export default TicketPage;
