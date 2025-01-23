import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Principal } from "@dfinity/principal";

import { AppDispatch, RootState } from "@/store";
import { useAuthManager } from "@/store/AuthProvider";
import { setUser } from "@/store/reducers/userSlice";
import { User } from "../../../declarations/ticketix_backend/ticketix_backend.did";
import { serializeUser } from "@/lib/utils";

const useUser = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();

  const { actor, isAuthenticated } = useAuthManager();

  const updateUser = (user: User) => {
    dispatch(setUser(serializeUser(user)));
  };

  const getUserById = async (userId: string) => {
    if (!actor) {
      return;
    }

    try {
      const result = await actor.getUserById(Principal.fromText(userId));

      if (result) {
        return result[0];
      }
      return null;
    } catch (error) {
      console.error("Error fetching creator content:", error);
    }
  };

  const getUserByUsername = async (username: string) => {
    if (!actor) {
      return;
    }

    try {
      const result = await actor.getUserByUsername(username);

      if (result) {
        return result[0];
      }
      return null;
    } catch (error) {
      console.error("Error fetching creator content:", error);
    }
  };

  return {
    user,
    getUserById,
    getUserByUsername,
    updateUser,
  };
};

export default useUser;
