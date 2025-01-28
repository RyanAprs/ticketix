import { Principal } from "@dfinity/principal";
import { _SERVICE } from "../../../../declarations/ticketix_backend/ticketix_backend.did";

export const getUserById = async (actor: _SERVICE, userId: Principal) => {
  try {
    const user = await actor.getUserById(userId);

    return user[0];
  } catch (error) {
    console.error("Error fetching ticket:", error);
  }
};
