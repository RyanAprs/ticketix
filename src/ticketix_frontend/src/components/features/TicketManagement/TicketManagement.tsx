import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { PlusIcon } from "lucide-react";

import useWindowSize from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils/cn";
import { useAuthManager } from "@/store/AuthProvider";

import { Ticket as TicketType } from "../../../../../declarations/ticketix_backend/ticketix_backend.did";

import CustomButton from "@/components/ui/Button/CustomButton";
import { fetchAllTicketOnSale } from "@/lib/services/TicketService";
import TicketPreview from "./TicketPreview";

const TicketManagement = () => {
  const { actor } = useAuthManager();
  const { isMobile } = useWindowSize();

  const [tickets, setTickets] = useState([] as TicketType[]);

  useEffect(() => {
    if (actor) {
      fetchAllTicketOnSale(actor, setTickets);
    }
  });

  return (
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
          "mt-3 w-full rounded-lg border border-border p-3 shadow-custom md:px-5 md:py-4",
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
            {/* {tickets.map((ticket) => (
              <Link key={ticket.id} to={`/ticket/${ticket.id}`}>
                <TicketPreview
                  title={ticket.title}
                  description={ticket.description}
                  imageUrl={ticket.imageUrl}
                  owner={ticket.owner}
                  price={ticket.price}
                  total={ticket.total}
                  salesDeadline={ticket.salesDeadline}
                />
              </Link>
            ))} */}
          </div>
        )}
      </div>
    </>
  );
};

export default TicketManagement;
