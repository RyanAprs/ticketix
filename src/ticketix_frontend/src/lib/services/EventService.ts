import { Principal } from "@dfinity/principal";
import { _SERVICE } from "../../../../declarations/ticketix_backend/ticketix_backend.did";

export const fetchAllEvents = async (actor: _SERVICE) => {
  try {
    const events = await actor.getAllEventPreviews();

    const ticketArray = events;
    return ticketArray;
  } catch (error) {
    console.error("Error fetching ticket:", error);
  }
};

export const getEventByCreator = async (
  actor: _SERVICE,
  setTicketsOwned: any,
  userId: Principal
) => {
  try {
    const tickets = await actor.getEventByCreator(userId);

    if ("ok" in tickets) {
      const ticketArray = tickets.ok;
      setTicketsOwned(ticketArray);
    } else {
      console.error("Error fetching tickets:", tickets.err);
    }
  } catch (error) {
    console.error("Error fetching ticket:", error);
  }
};

export const fetchDetailTicket = async (actor: _SERVICE, eventId: string) => {
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
