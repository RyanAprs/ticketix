// import React, {
//   createContext,
//   ReactNode,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Actor, HttpAgent, Identity } from "@dfinity/agent";
// import { AuthClient } from "@dfinity/auth-client";
// import { Principal } from "@dfinity/principal";
// import {
//   BACKEND_CANISTER_ID,
//   DFX_NETWORK,
//   INTERNET_IDENTITY_URL,
// } from "@/constant/common";
// import { AppDispatch, RootState } from "@/store";
// import { setUser, setIsAuthenticated } from "@/store/reducers/userSlice";
// import { AccountIdentifier } from "@dfinity/ledger-icp";
// import { useNavigate } from "react-router-dom";
// import { RoleType, UserType } from "@/types";
// import { _SERVICE } from "../../../declarations/ticketix_backend/ticketix_backend.did";
// import { idlFactory } from "../../../declarations/ticketix_backend";

// // Types
// interface AuthState {
//   identity: Identity | null;
//   principal: Principal | null;
//   actor: _SERVICE | null;
//   isLoading: boolean;
//   authClient: AuthClient | null;
// }

// interface AuthContextType extends AuthState {
//   isAuthenticated: boolean;
//   login: (role: RoleType) => Promise<void>;
//   logout: () => Promise<void>;
//   initializeAuth: () => Promise<void>;
// }

// // Create the context with a default value
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Provider component
// export const AuthProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { isAuthenticated } = useSelector((state: RootState) => state.user);
//   const navigate = useNavigate();

//   const [authState, setAuthState] = useState<AuthState>({
//     identity: null,
//     principal: null,
//     actor: null,
//     isLoading: true,
//     authClient: null,
//   });

//   // Create actor instance
//   const createActor = useCallback(
//     async (identity?: Identity): Promise<_SERVICE> => {
//       const agent = await HttpAgent.create({
//         identity,
//         shouldFetchRootKey: DFX_NETWORK === "local",
//       });
//       return Actor.createActor(idlFactory, {
//         agent,
//         canisterId: BACKEND_CANISTER_ID,
//       }) as unknown as _SERVICE;
//     },
//     []
//   );

//   // Initialize or update auth state
//   const initializeAuth = useCallback(async () => {
//     const authClient = await AuthClient.create({
//       idleOptions: { disableIdle: true },
//     });

//     try {
//       if (await authClient.isAuthenticated()) {
//         const identity = authClient.getIdentity();
//         const principal = identity.getPrincipal();
//         const actor = await createActor(identity);

//         setAuthState({
//           identity,
//           principal,
//           actor,
//           isLoading: false,
//           authClient,
//         });

//         const users = await actor.getUserByPrincipal(principal);

//         if (users && users.length > 0) {
//           const matchedUsers = users.filter(
//             (user) => user.id.toText() === principal.toText()
//           );

//           if (matchedUsers.length > 0) {
//             matchedUsers.forEach((user) => {
//               console.log(user);
//               console.log("Principal:", user.id);
//               console.log("role:", user.role);
//               console.log("votes:", user.votedItems);
//             });
//           } else {
//             console.log("No users found with the same principal");
//           }
//         } else {
//           console.log("No users found");
//         }

//         // dispatch(setUser(principal));
//         dispatch(setIsAuthenticated(true));
//       } else {
//         const anonymousActor = await createActor();
//         setAuthState({
//           identity: null,
//           principal: null,
//           actor: anonymousActor,
//           isLoading: false,
//           authClient,
//         });
//         dispatch(setIsAuthenticated(false));
//       }
//     } catch (error) {
//       console.error("Error initializing auth:", error);
//       setAuthState((prev) => ({ ...prev, isLoading: false }));
//       dispatch(setUser(null));
//       dispatch(setIsAuthenticated(false));
//     }
//   }, [createActor, dispatch]);

//   // Logout handler
//   const logout = useCallback(async () => {
//     const authClient = await AuthClient.create();
//     try {
//       await authClient.logout();
//       const anonymousActor = await createActor();
//       setAuthState({
//         identity: null,
//         principal: null,
//         actor: anonymousActor,
//         isLoading: false,
//         authClient,
//       });
//       dispatch(setUser(null));
//       dispatch(setIsAuthenticated(false));
//       navigate("/");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   }, [createActor, dispatch, navigate]);

//   // Login handler
//   const login = useCallback(
//     async (role: RoleType) => {
//       setAuthState((prev) => ({ ...prev, isLoading: true }));
//       try {
//         const authClient = await AuthClient.create({
//           idleOptions: { disableIdle: true },
//         });

//         await authClient.login({
//           identityProvider: INTERNET_IDENTITY_URL,
//           maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
//           onSuccess: async () => {
//             const identity = authClient.getIdentity();
//             const principal = identity.getPrincipal();
//             const actor = await createActor(identity);

//             const accountIdentifier = AccountIdentifier.fromPrincipal({
//               principal,
//               subAccount: undefined,
//             });
//             // const result = await actor.authenticateUser(principal);

//             // console.log(result);

//             // if (result === true) {
//             //   setAuthState({
//             //     identity,
//             //     principal,
//             //     actor,
//             //     isLoading: false,
//             //     authClient,
//             //   });

//             //   // const user: UserType = {
//             //   //   id: principal.toString(),
//             //   //   role,
//             //   //   votedItems: [],
//             //   // };

//             //   // // Simpan informasi pengguna
//             //   // dispatch(setUser(user));
//             //   dispatch(setIsAuthenticated(true));

//             //   // Redirect berdasarkan role
//             //   if (role === "nominator") {
//             //     navigate("/nominator/dashboard", { replace: true });
//             //   } else if (role === "voter") {
//             //     navigate("/voter/dashboard", { replace: true });
//             //   } else {
//             //     navigate("/", { replace: true });
//             //   }
//             // } else {
//             //   throw new Error("something went wrong");
//             // }
//           },
//           onError: (error) => {
//             console.error("Login failed:", error);
//             logout();
//           },
//         });
//       } catch (error) {
//         console.error("Login failed:", error);
//         logout();
//       }
//     },
//     [createActor, dispatch, logout, navigate]
//   );

//   // Initialize auth on mount
//   useEffect(() => {
//     initializeAuth();
//   }, [initializeAuth]);

//   // Memoize the context value
//   const contextValue = useMemo(
//     () => ({
//       ...authState,
//       isAuthenticated,
//       login,
//       logout,
//       initializeAuth,
//     }),
//     [authState, isAuthenticated, login, logout, initializeAuth]
//   );

//   return (
//     <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
//   );
// };

// // Custom hook to use the auth context
// export const useAuthManager = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuthManager must be used within an AuthProvider");
//   }
//   return context;
// };
