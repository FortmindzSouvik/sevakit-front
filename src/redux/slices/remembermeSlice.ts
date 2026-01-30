import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

interface AuthState {
  phoneNumber: string | null;
  password: string | null;
  rememberMe: boolean;
}

const initialState: AuthState = {
  phoneNumber: null,
  password: null,
  rememberMe: false,
};

const remembermeSlice = createSlice({
  name: "rememberMe",
  initialState,
  reducers: {
    setRememberMe: (state, action) => {
      state.phoneNumber = action.payload.phoneNumber;
      state.password = action.payload.password;
      state.rememberMe = action.payload.remember;
    },

    clearRememberMe: (state) => {
      state.phoneNumber = null;
      state.password = null;
      state.rememberMe = false;
    },
  },
});

export const { setRememberMe, clearRememberMe } = remembermeSlice.actions;
const persistConfig = {
  key: "rememberMe",
  storage,
};

const persistedRememberMeReducer = persistReducer(
  persistConfig,
  remembermeSlice.reducer
);

export default persistedRememberMeReducer;
