import { useEffect, useState } from "react";
import useWindowSize from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils/cn";
import { useAuthManager } from "@/store/AuthProvider";
import IsLoadingPage from "../isLoadingPage/IsLoadingPage";
import { getTicketByOwner } from "@/lib/services/TicketService";
import { Ticket as TicketType } from "../../../../../declarations/ticketix_backend/ticketix_backend.did";
import { Ticket } from "lucide-react";
import CustomButton from "@/components/ui/Button/CustomButton";

const TicketManagement = () => {
  const { actor, principal } = useAuthManager();
  const { isMobile } = useWindowSize();
  const [tickets, setTickets] = useState([] as TicketType[]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (actor && principal) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const result = await getTicketByOwner(actor, principal);
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

  if (loading) return <IsLoadingPage />;

  return (
    <>
      {loading ? (
        <IsLoadingPage />
      ) : (
        <div className="flex flex-col w-full h-full space-y-6">
          <div className="w-full flex flex-col gap-3 md:flex-row md:justify-between">
            <h1 className="text-2xl font-semibold text-title lg:text-3xl">
              Your Tickets
            </h1>
          </div>

          <div
            className={cn(
              "w-full",
              tickets.length === 0 &&
                "flex items-center justify-center min-h-[200px] md:min-h-[300px]"
            )}
          >
            {tickets.length === 0 ? (
              <div className="text-center text-subtext">
                <p className="font-semibold md:text-lg">
                  No ticket yet, Buy first!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tickets.map((ticket, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Ticket className="w-5 h-5 text-indigo-500" />
                        </div>
                        <span className="text-lg font-semibold text-indigo-600">
                          {ticket.price} ICP
                        </span>
                      </div>
                      <CustomButton className="w-full py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Use Ticket
                      </CustomButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TicketManagement;
