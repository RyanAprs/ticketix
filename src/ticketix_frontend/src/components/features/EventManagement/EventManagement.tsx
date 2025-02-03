import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarX, Camera, PlusIcon } from "lucide-react";
import useWindowSize from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils/cn";
import { useAuthManager } from "@/store/AuthProvider";
import { Event as EventType } from "../../../../../declarations/ticketix_backend/ticketix_backend.did";
import { formatNSToDate } from "@/lib/utils";
import EventOwnedPreview from "./EventOwnedPreview";
import IsLoadingPage from "../isLoadingPage/IsLoadingPage";
import CustomButton from "@/components/ui/Button/CustomButton";
import { getEventByCreator } from "@/lib/services/EventService";

const EventManagement = () => {
  const { actor, principal } = useAuthManager();
  const { isMobile } = useWindowSize();

  const [events, setEvent] = useState([] as EventType[]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (actor && principal) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const result = await getEventByCreator(actor, principal);
          if (result) {
            setEvent(result);
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

  return (
    <div className="flex flex-col w-full min-h-screen px-1 md:px-8 gap-4 md:py-2 py-4 md:gap-6">
      {/* Header dan Tombol */}
      <div className="w-full flex flex-col gap-3 md:flex-row md:justify-between">
        <h1 className="text-2xl font-semibold text-title lg:text-3xl">
          Manage Your Event
        </h1>

        <div className="flex gap-2">
          <Link to={"/dashboard/event/scan-ticket"}>
            <CustomButton
              variant="secondary"
              className="w-fit"
              icon={<Camera className="mr-1 size-5" />}
              size={isMobile ? "small" : "default"}
            >
              Scan Ticket
            </CustomButton>
          </Link>
          <Link to={"/dashboard/event/post"}>
            <CustomButton
              variant="secondary"
              className="w-fit"
              icon={<PlusIcon className="mr-1 size-5" />}
              size={isMobile ? "small" : "default"}
            >
              Create Your Event
            </CustomButton>
          </Link>
        </div>
      </div>

      {/* Event List Section */}
      <div
        className={cn(
          "w-full",
          events.length === 0 &&
            "flex items-center justify-center min-h-[200px] md:min-h-[300px]"
        )}
      >
        {loading ? (
          <IsLoadingPage />
        ) : (
          <>
            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 rounded-lg w-full">
                <CalendarX className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900">
                  No Events Available
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  No events found, Create your event first
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 w-full">
                {events.map((event) => {
                  if (!event.eventDate) return null;

                  const eventDate = Number(event.eventDate);
                  const formattedDate = formatNSToDate(
                    BigInt(eventDate * 1_000_000)
                  );

                  return (
                    <EventOwnedPreview
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
    </div>
  );
};

export default EventManagement;
