import { Principal } from "@dfinity/principal";
import { _SERVICE } from "../../../../declarations/ticketix_backend/ticketix_backend.did";

export const fetchAllEvents = async (actor: _SERVICE) => {
  try {
    const events = await actor.getAllEventPreviews();

    if (events) {
      return events;
    }
  } catch (error) {
    console.error("Error fetching ticket:", error);
  }
};

export const getEventByCreator = async (actor: _SERVICE, userId: Principal) => {
  try {
    const events = await actor.getEventByCreator(userId);

    if ("ok" in events) {
      return events.ok;
    } else {
      console.error("Error fetching events:", events);
    }
  } catch (error) {
    console.error("Error fetching ticket:", error);
  }
};

export const fetchDetailEvent = async (actor: _SERVICE, eventId: string) => {
  try {
    const events = await actor.getEventDetail(eventId);

    if ("ok" in events) {
      const ticketArray = events.ok;
      return ticketArray;
    } else {
      console.error("Error fetching events:", events.err);
    }
  } catch (error) {
    console.error("Error fetching ticket:", error);
  }
};
