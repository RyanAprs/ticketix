import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { PlusIcon } from "lucide-react";

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
          await getEventByCreator(actor, setEvent, principal);
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
              Event Management
            </h1>

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
          <div
            className={cn(
              "mt-3 w-full p-3  md:px-5 md:py-4",
              events.length === 0 &&
                "flex min-h-[200px] max-w-[600px] items-center justify-center md:min-h-[300px]"
            )}
          >
            {events.length === 0 ? (
              <div className="mb-4 flex flex-col items-center space-y-3 text-subtext">
                <p className="text-center font-semibold md:text-lg">
                  No event yet, Create your event first!
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => {
                    if (!event.salesDeadline) return null;

                    const salesDeadline = Number(event.salesDeadline);
                    const formattedDate = formatNSToDate(
                      BigInt(salesDeadline * 1_000_000)
                    );

                    return (
                      <EventOwnedPreview
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
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default EventManagement;
