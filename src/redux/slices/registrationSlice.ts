import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

interface AccountForm {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  password: string;
  phoneNumber: string;
  terms: boolean;
}

interface ParentForm {
  parentName: string;
  parentDateOfBirth: string;
  relationshipToMinor: string;
}

interface RegistrationState {
  accountForm: AccountForm | null;
  parentForm: ParentForm | null;
}

const initialState: RegistrationState = {
  accountForm: null,
  parentForm: null,
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    saveAccountForm: (state, action: PayloadAction<AccountForm>) => {
      state.accountForm = action.payload;
      // state.accountForm = {
      //   firstName: action.payload.firstName,
      //   lastName: action.payload.lastName,
      //   email: action.payload.email,
      //   dob: action.payload.dob,
      //   terms: action.payload.terms,
      // };
    },

    saveParentForm: (state, action: PayloadAction<ParentForm>) => {
      state.parentForm = action.payload;
    },

    clearRegistration: (state) => {
      state.accountForm = null;
      state.parentForm = null;
    },
  },
});

export const { saveAccountForm, saveParentForm, clearRegistration } =
  registrationSlice.actions;

const persistConfig = {
  key: "registration",
  storage,
};

const persistedRegsitrationReducer = persistReducer(
  persistConfig,
  registrationSlice.reducer
);

export default persistedRegsitrationReducer;
