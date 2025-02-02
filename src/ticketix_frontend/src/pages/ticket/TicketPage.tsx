import IsLoadingPage from "@/components/features/isLoadingPage/IsLoadingPage";
import TicketEventPreview from "@/components/features/TicketManagement/TicketEventPreview";
import { Button } from "@/components/ui/Button/button";
import CustomButton from "@/components/ui/Button/CustomButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog/dialog";
import Layout from "@/components/ui/Layout/Layout";
import { getTicketByOwner } from "@/lib/services/TicketService";
import { getUserById } from "@/lib/services/UserService";
import { useAuthManager } from "@/store/AuthProvider";
import { TicketType } from "@/types";
import { Principal } from "@dfinity/principal";
import { ArrowLeft, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Ticket as TicketOwnedType } from "../../../../declarations/ticketix_backend/ticketix_backend.did";

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
  const [loading, setLoading] = useState(false);
  const [ticketOwned, setTicketOwned] = useState([] as TicketOwnedType[]);

  const handleResellClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

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

    if (actor && principal) {
      const fetchOwnedTicket = async () => {
        try {
          setLoading(true);
          const result = await getTicketByOwner(actor, principal);
          console.log(result);

          if (result) {
            setTicketOwned(result);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchOwnedTicket();
    }

    fetchData();
  }, [actor, idTicket]);

  const handleResellTicket = () => {
    handleCloseDialog();
  };

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
        <div className="flex flex-col gap-4 mt-20">
          <div className="flex justify-between items-center">
            <Link to={`/event/${idTicket}`} className="w-3/4">
              <CustomButton className="flex justify-center items-center gap-2 text-white">
                <ArrowLeft />
                Back
              </CustomButton>
            </Link>
            <CustomButton className="text-white" onClick={handleResellClick}>
              Resell Ticket
            </CustomButton>
          </div>
          <TicketEventPreview tickets={tickets} />
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-96 h-1/2">
          <DialogHeader>
            <DialogTitle>Resell Tickets</DialogTitle>
            <DialogDescription>
              Select the tickets you want to resell.
            </DialogDescription>
          </DialogHeader>
          <>
            {ticketOwned.length === 0 ? (
              <div className="text-center text-subtext">
                <p className="font-semibold md:text-lg">
                  No ticket yet, Buy first!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {ticketOwned.map((ticket, index) => (
                  <div
                    key={index}
                    className="bg-blue-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Ticket className="w-5 h-5 text-indigo-500" />
                        </div>
                        <span className="text-lg font-semibold text-indigo-600">
                          {ticket.price} ICP
                        </span>
                      </div>
                      <Link to={`/event/${ticket.eventId}`}>
                        <CustomButton className="w-full py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Sell Ticket
                        </CustomButton>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleResellTicket}>Confirm Resell</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TicketPage;
