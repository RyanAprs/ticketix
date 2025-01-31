import { Principal } from "@dfinity/principal";
import { _SERVICE } from "../../../../declarations/ticketix_backend/ticketix_backend.did";

export const getTicketByOwner = async (actor: _SERVICE, userId: Principal) => {
  try {
    const tickets = await actor.getTicketByOwner(userId);

    if ("ok" in tickets) {
      return tickets.ok;
    } else {
      console.error("Error fetching tickets:", tickets);
    }
  } catch (error) {
    console.error("Error fetching ticket:", error);
  }
};
