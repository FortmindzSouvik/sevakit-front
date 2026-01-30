import type { IUserData } from "@/interfaces/auth.interfaces";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState: { userData: IUserData | null } = { userData: null };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<IUserData>) {
      state.userData = action.payload;
    },
    clearUserData(state) {
      state.userData = null;
    },
    updateTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) {
      if (state.userData) {
        state.userData.accessToken = action.payload.accessToken;
        state.userData.refreshToken = action.payload.refreshToken;
      }
    },
    updateHasUsedTrial(
      state,
      action: PayloadAction<{
        hasUsedTrial: boolean;
        subscriptionStatus: string;
      }>
    ) {
      if (state.userData) {
        state.userData.hasUsedTrial = action.payload.hasUsedTrial;
        state.userData.subscriptionStatus = action.payload.subscriptionStatus;
      }
    },
  },
});

export const { setUserData, clearUserData, updateTokens, updateHasUsedTrial } =
  userSlice.actions;

const persistConfig = {
  key: "user",
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userSlice.reducer);

export default persistedUserReducer;
