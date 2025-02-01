import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";
import {
  BACKEND_CANISTER_ID,
  DFX_NETWORK,
  INTERNET_IDENTITY_URL,
} from "@/constant/common";
import { AppDispatch, RootState } from "@/store";
import { setUser, setIsAuthenticated } from "@/store/reducers/userSlice";
import { useNavigate } from "react-router-dom";
import { _SERVICE } from "../../../declarations/ticketix_backend/ticketix_backend.did";
import { idlFactory } from "../../../declarations/ticketix_backend";
import { generateRandomString, serializeUser } from "@/lib/utils/index";

interface AuthState {
  identity: Identity | null;
  principal: Principal | null;
  actor: _SERVICE | null;
  isLoading: boolean;
  authClient: AuthClient | null;
}

interface AuthContextType extends AuthState {
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [authState, setAuthState] = useState<AuthState>({
    identity: null,
    principal: null,
    actor: null,
    isLoading: true,
    authClient: null,
  });

  const createActor = useCallback(
    async (identity?: Identity): Promise<_SERVICE> => {
      const agent = await HttpAgent.create({
        identity,
        shouldFetchRootKey: DFX_NETWORK === "local",
      });
      return Actor.createActor(idlFactory, {
        agent,
        canisterId: BACKEND_CANISTER_ID,
      }) as unknown as _SERVICE;
    },
    []
  );

  const initializeAuth = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    const authClient = await AuthClient.create({
      idleOptions: { disableIdle: true },
    });

    if (await authClient.isAuthenticated()) {
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal();
      const actor = await createActor(identity);

      setAuthState({
        identity,
        principal,
        actor,
        isLoading: false,
        authClient,
      });

      dispatch(setIsAuthenticated(true));
    } else {
      const anonymousActor = await createActor();
      setAuthState({
        identity: null,
        principal: null,
        actor: anonymousActor,
        isLoading: false,
        authClient,
      });
      dispatch(setUser(null));
      dispatch(setIsAuthenticated(false));
    }

    // try {
    //   if (await authClient.isAuthenticated()) {
    //     const identity = authClient.getIdentity();
    //     const principal = identity.getPrincipal();
    //     const actor = await createActor(identity);

    //     setAuthState({
    //       identity,
    //       principal,
    //       actor,
    //       isLoading: false,
    //       authClient,
    //     });

    //     const users = await actor.getUserByPrincipal(principal);

    //     if (users && users.length > 0) {
    //       const matchedUsers = users.filter(
    //         (user) => user.id.toText() === principal.toText()
    //       );

    //       if (matchedUsers.length > 0) {
    //         matchedUsers.forEach((user) => {
    //           dispatch(setUser(serializeUser(user)));
    //         });
    //       } else {
    //         console.log("No users found with the same principal");
    //       }
    //     } else {
    //       console.log("No users found");
    //     }

    //     dispatch(setIsAuthenticated(true));
    //   } else {
    //     const anonymousActor = await createActor();
    //     setAuthState({
    //       identity: null,
    //       principal: null,
    //       actor: anonymousActor,
    //       isLoading: false,
    //       authClient,
    //     });
    //     dispatch(setIsAuthenticated(false));
    //   }
    // } catch (error) {
    //   console.error("Error initializing auth:", error);
    //   setAuthState((prev) => ({ ...prev, isLoading: false }));
    //   dispatch(setUser(null));
    //   dispatch(setIsAuthenticated(false));
    // }
  }, [createActor, dispatch]);

  // Logout handler
  const logout = useCallback(async () => {
    const authClient = await AuthClient.create();
    try {
      await authClient.logout();
      const anonymousActor = await createActor();
      setAuthState({
        identity: null,
        principal: null,
        actor: anonymousActor,
        isLoading: false,
        authClient,
      });
      dispatch(setUser(null));
      dispatch(setIsAuthenticated(false));
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [createActor, dispatch, navigate]);

  const login = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const authClient = await AuthClient.create({
        idleOptions: { disableIdle: true },
      });

      await authClient.login({
        identityProvider: INTERNET_IDENTITY_URL,
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal();
          const actor = await createActor(identity);

          const users = await actor.getUserByPrincipal(principal);

          let user;
          if (users && users.length > 0) {
            const existingUser = users.find(
              (u) => u.id.toText() === principal.toText()
            );
            if (existingUser) {
              user = serializeUser(existingUser);
            }
          } else {
            const randomString = generateRandomString();
            const username = `user${randomString}`;
            user = {
              id: principal.toString(),
              username: username,
            };

            const result = await actor.authenticateUser(username);
            if ("ok" in result) {
              console.log(result.ok);

              setAuthState({
                identity,
                principal,
                actor,
                isLoading: false,
                authClient,
              });
              dispatch(setUser(serializeUser(result.ok)));
              dispatch(setIsAuthenticated(true));
              navigate("/dashboard", { replace: true });
            } else {
              throw new Error(result.err);
            }
          }

          // Simpan data pengguna ke Redux
          if (user) {
            dispatch(setUser(user));
            dispatch(setIsAuthenticated(true));
            navigate("/dashboard", { replace: true });
          } else {
            console.error("Failed to retrieve or create user");
          }
        },
        onError: (error) => {
          console.error("Login failed:", error);
          logout();
        },
      });
    } catch (error) {
      console.error("Login failed:", error);
      logout();
    }
  }, [createActor, dispatch, navigate]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const contextValue = useMemo(
    () => ({
      ...authState,
      isAuthenticated,
      login,
      logout,
      initializeAuth,
    }),
    [authState, isAuthenticated, login, logout, initializeAuth]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthManager = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthManager must be used within an AuthProvider");
  }
  return context;
};
