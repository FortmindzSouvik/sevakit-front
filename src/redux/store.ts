import { persistStore } from "redux-persist";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import persistedUserReducer from "./slices/userSlice";
import persistedRegsitrationReducer from "./slices/registrationSlice";
import persistedRememberMeReducer from "./slices/remembermeSlice";
import persistedProviderReducer from "./slices/providerSlice";

const rootReducer = combineReducers({
  user: persistedUserReducer,
  registration: persistedRegsitrationReducer,
  rememberMe: persistedRememberMeReducer,
  provider: persistedProviderReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["register"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
