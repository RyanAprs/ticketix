import { Principal } from "@dfinity/principal";
import { _SERVICE } from "../../../../declarations/ticketix_backend/ticketix_backend.did";

export const fetchAllTicketOnSale = async (
  actor: _SERVICE,
  setTickets: any
) => {
  try {
    const tickets = await actor.getAllForSaleTicketPreviews();

    if ("ok" in tickets) {
      const ticketArray = tickets.ok;
      setTickets(ticketArray);
    } else {
      console.error("Error fetching tickets:", tickets.err);
    }
  } catch (error) {
    console.error("Error fetching ticket:", error);
  }
};

export const fetchAllTicketOwned = async (
  actor: _SERVICE,
  setTicketsOwned: any,
  userId: Principal
) => {
  try {
    const tickets = await actor.getAllOwnedTickets(userId);

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

export const fetchDetailTicket = async (actor: _SERVICE, ticketId: string) => {
  try {
    const tickets = await actor.getTicketDetail(ticketId);

    if ("ok" in tickets) {
      const ticketArray = tickets.ok;
      return ticketArray;
    } else {
      console.error("Error fetching tickets:", tickets.err);
    }
  } catch (error) {
    console.error("Error fetching ticket:", error);
  }
};
