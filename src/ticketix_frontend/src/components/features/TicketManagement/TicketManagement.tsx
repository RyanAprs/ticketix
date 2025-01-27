import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { PlusIcon } from "lucide-react";

import useWindowSize from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils/cn";
import { useAuthManager } from "@/store/AuthProvider";

import { Ticket as TicketType } from "../../../../../declarations/ticketix_backend/ticketix_backend.did";

import CustomButton from "@/components/ui/Button/CustomButton";
import { fetchAllTicketOwned } from "@/lib/services/TicketService";
import { formatNSToDate } from "@/lib/utils";
import { Principal } from "@dfinity/principal";
import TicketOwnedPreview from "./TicketOwnedPreview";
import IsLoadingPage from "../isLoadingPage/IsLoadingPage";

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
          await fetchAllTicketOwned(actor, setTickets, principal);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [actor, principal]);

  return (
    <>
      {loading ? (
        <IsLoadingPage />
      ) : (
        <>
          <div className="flex flex-col gap-3 md:flex-row md:justify-between">
            <h1 className="text-2xl font-semibold text-title lg:text-3xl">
              Ticket Management
            </h1>
            <Link to={"/dashboard/ticket/post"}>
              <CustomButton
                variant="secondary"
                className="w-fit"
                icon={<PlusIcon className="mr-1 size-5" />}
                size={isMobile ? "small" : "default"}
              >
                Sale New Ticket
              </CustomButton>
            </Link>
          </div>
          <div
            className={cn(
              "mt-3 w-full p-3  md:px-5 md:py-4",
              tickets.length === 0 &&
                "flex min-h-[200px] max-w-[600px] items-center justify-center md:min-h-[300px]"
            )}
          >
            {tickets.length === 0 ? (
              <div className="mb-4 flex flex-col items-center space-y-3 text-subtext">
                <p className="text-center font-semibold md:text-lg">
                  No ticket yet, Sale or buy a ticket first!
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {tickets.map((ticket) => {
                    if (!ticket.salesDeadline) return null;

                    const salesDeadline = Number(ticket.salesDeadline);
                    const formattedDate = formatNSToDate(
                      BigInt(salesDeadline * 1_000_000)
                    );

                    return (
                      <TicketOwnedPreview
                        key={ticket.id}
                        id={ticket.id}
                        title={ticket.title}
                        total={Number(ticket.total)}
                        imageUrl={ticket.imageUrl}
                        price={ticket.price}
                        salesDeadline={formattedDate}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default TicketManagement;
