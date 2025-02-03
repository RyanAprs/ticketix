import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { useAuthManager } from "@/store/AuthProvider";
import { Event as EventType } from "../../../../declarations/ticketix_backend/ticketix_backend.did";
import Layout from "@/components/ui/Layout/Layout";
import IsLoadingPage from "@/components/features/isLoadingPage/IsLoadingPage";
import { formatNSToDate } from "@/lib/utils";
import EventPreview from "@/components/features/EventManagement/EventPreview";
import { fetchAllEvents } from "@/lib/services/EventService";
import { CalendarX } from "lucide-react";

const EventPage = () => {
  const { actor } = useAuthManager();

  const [events, setEvents] = useState([] as EventType[]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (actor) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const result = await fetchAllEvents(actor);
          console.log(result);

          if (result) {
            setEvents(result);
          }
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
    <Layout>
      <div className="flex flex-col gap-3 md:flex-row md:justify-between mt-20">
        <h1 className="text-2xl font-semibold text-title lg:text-3xl">
          Find Your events
        </h1>
      </div>
      <div
        className={cn(
          "mt-3 w-full p-3 md:px-5 md:py-4 flex items-center justify-center",
          events.length === 0 && "min-h-[50vh]"
        )}
      >
        {loading ? (
          <IsLoadingPage />
        ) : (
          <>
            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 rounded-lg w-full text-center">
                <CalendarX className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900">
                  No Events Available, check again later!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => {
                  if (!event.eventDate) return null;

                  const eventDate = Number(event.eventDate);
                  const formattedDate = formatNSToDate(
                    BigInt(eventDate * 1_000_000)
                  );

                  return (
                    <EventPreview
                      key={event.id}
                      id={event.id}
                      title={event.title}
                      total={Number(event.total)}
                      imageUrl={event.imageUrl}
                      eventDate={formattedDate}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default EventPage;
