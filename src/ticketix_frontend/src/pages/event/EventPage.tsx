import React, { useEffect, useState } from "react";
import useWindowSize from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils/cn";
import { useAuthManager } from "@/store/AuthProvider";

import { Event as EventType } from "../../../declarations/ticketix_backend/ticketix_backend.did";

import { fetchAllTicketOnSale } from "@/lib/services/TicketService";
import Layout from "@/components/ui/Layout/Layout";
import IsLoadingPage from "@/components/features/isLoadingPage/IsLoadingPage";
import { formatNSToDate } from "@/lib/utils";
import EventPreview from "@/components/features/TicketManagement/EventPreview";

const EventPage = () => {
  const { actor } = useAuthManager();

  const [events, setEvents] = useState([] as EventType[]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (actor) {
      const fetchData = async () => {
        try {
          setLoading(true);
          await fetchAllTicketOnSale(actor, setEvents);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [actor]);

  return (
    <>
      {loading ? (
        <Layout>
          <IsLoadingPage />
        </Layout>
      ) : (
        <Layout>
          <div className="flex flex-col gap-3 md:flex-row md:justify-between">
            <h1 className="text-2xl font-semibold text-title lg:text-3xl">
              Find Your events
            </h1>
          </div>
          <div
            className={cn(
              "mt-3 w-full  p-3  md:px-5 md:py-4",
              events.length === 0 &&
                "flex min-h-[200px] max-w-[600px] items-center justify-center md:min-h-[300px]"
            )}
          >
            {events.length === 0 ? (
              <div className="mb-4 flex flex-col items-center space-y-3 text-subtext">
                <p className="text-center font-semibold md:text-lg">
                  No events for sale, check again later!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => {
                  if (!event.salesDeadline) return null;

                  const salesDeadline = Number(event.salesDeadline);
                  const formattedDate = formatNSToDate(
                    BigInt(salesDeadline * 1_000_000)
                  );

                  return (
                    <EventPreview
                      key={event.id}
                      id={event.id}
                      title={event.title}
                      total={Number(event.total)}
                      imageUrl={event.imageUrl}
                      salesDeadline={formattedDate}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </Layout>
      )}
    </>
  );
};

export default EventPage;
