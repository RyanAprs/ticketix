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

export const getUserById = async (actor: _SERVICE, userId: Principal) => {
  try {
    const user = await actor.getUserById(userId);

    return user[0];
  } catch (error) {
    console.error("Error fetching ticket:", error);
  }
};
