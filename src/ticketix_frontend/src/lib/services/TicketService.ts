import { _SERVICE } from "../../../../declarations/ticketix_backend/ticketix_backend.did";

export const fetchAllTicketOnSale = async (
  actor: _SERVICE,
  setTickets: any
) => {
  try {
    const tickets = await actor.getAllForSaleTicketPreviews();

    if ("ok" in tickets) {
      const ticketArray = tickets.ok;
      console.log(ticketArray);
      setTickets(ticketArray);
    } else {
      console.error("Error fetching tickets:", tickets.err);
    }
  } catch (error) {
    console.error("Error fetching ticket:", error);
  }
};
