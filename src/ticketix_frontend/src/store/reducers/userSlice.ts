import { UserType } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: UserType | null;
  isAuthenticated: boolean;
  icpPrice: number;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  icpPrice: 0,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType | null>) => {
      state.user = action.payload;
      state.isAuthenticated = action.payload !== null;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setIcpPrice: (state, action: PayloadAction<number>) => {
      state.icpPrice = action.payload;
    },
  },
});

export const { setUser, clearUser, setIsAuthenticated, setIcpPrice } =
  userSlice.actions;

const userReducer = userSlice.reducer;
export default userReducer;
