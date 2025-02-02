import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { useAuthManager } from "@/store/AuthProvider";
import IsLoadingPage from "../isLoadingPage/IsLoadingPage";
import { getTicketByOwner } from "@/lib/services/TicketService";
import { Ticket as TicketType } from "../../../../../declarations/ticketix_backend/ticketix_backend.did";
import { Ticket } from "lucide-react";
import CustomButton from "@/components/ui/Button/CustomButton";

const TicketManagement = () => {
  const { actor, principal } = useAuthManager();
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([] as TicketType[]);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (actor && principal) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const result = await getTicketByOwner(actor, principal);
          console.log(result);

          if (result) {
            setTickets(result);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [actor, principal]);

  const filteredTickets = tickets.filter((ticket) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "owned" && "owned" in ticket.status) return true;
    if (filterStatus === "forSale" && "forSale" in ticket.status) return true;
    if (filterStatus === "used" && "used" in ticket.status) return true;
    return false;
  });

  return (
    <>
      <div className="flex flex-col w-full min-h-screen px-4 md:px-8 gap-6">
        <div className="w-full flex flex-col gap-3 md:flex-row md:justify-between">
          <h1 className="text-2xl font-semibold text-title lg:text-3xl">
            Your Tickets
          </h1>

          {/* Filter Buttons */}
          <div className="flex space-x-2">
            {["all", "owned", "forSale", "used"].map((status) => (
              <CustomButton
                key={status}
                className={cn(
                  "py-2 px-4 text-sm font-medium rounded-lg",
                  filterStatus === status
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700"
                )}
                onClick={() => setFilterStatus(status)}
              >
                {status === "all"
                  ? "All"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </CustomButton>
            ))}
          </div>
        </div>

        {loading ? (
          <IsLoadingPage />
        ) : (
          <>
            <div
              className={cn(
                "w-full",
                filteredTickets.length === 0 &&
                  "flex items-center justify-center min-h-[200px] md:min-h-[300px]"
              )}
            >
              {filteredTickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg w-full">
                  <Ticket className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900">
                    No Tickets Available
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    No tickets found for this category.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 w-full">
                  {filteredTickets.map((ticket, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 w-full"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-indigo-50 rounded-lg">
                            <Ticket className="w-10 h-10 text-indigo-600" />
                          </div>
                          <div className="text-xl">
                            <p className="font-medium text-gray-900">
                              Ticket #{ticket.id}
                            </p>
                            <p className="text-sm text-gray-500">
                              Event ID: {ticket.eventId}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-indigo-600">
                            {ticket.price} ICP
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TicketManagement;
