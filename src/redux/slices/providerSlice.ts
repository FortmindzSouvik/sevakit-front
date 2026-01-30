import type { IProviderData } from "@/interfaces/auth.interfaces";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState: { providerData: IProviderData | null } = { providerData: null };

const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {
    setProviderData(state, action: PayloadAction<IProviderData>) {
      state.providerData = action.payload;
    },
    clearProviderData(state) {
      state.providerData = null;
    },
    updateProviderTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) {
      if (state.providerData) {
        state.providerData.accessToken = action.payload.accessToken;
        state.providerData.refreshToken = action.payload.refreshToken;
      }
    },
    updateProviderHasUsedTrial(
      state,
      action: PayloadAction<{
        hasUsedTrial: boolean;
        subscriptionStatus: string;
      }>,
    ) {
      if (state.providerData) {
        state.providerData.hasUsedTrial = action.payload.hasUsedTrial;
        state.providerData.subscriptionStatus =
          action.payload.subscriptionStatus;
      }
    },
  },
});

export const {
  setProviderData,
  clearProviderData,
  updateProviderTokens,
  updateProviderHasUsedTrial,
} = providerSlice.actions;

const persistConfig = {
  key: "provider",
  storage,
};

const persistedProviderReducer = persistReducer(
  persistConfig,
  providerSlice.reducer,
);

export default persistedProviderReducer;
