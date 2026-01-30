import type { IBaseApiResponse } from "./baseapi.interfaces";

export interface ILoginApiResponse extends IBaseApiResponse {
  data: IUserData;
}

export interface IUserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  hasUsedTrial?: boolean;
  redirectToPayNow?: boolean;
  subscriptionStatus?: string;
  sevaId?: string;
}

export interface IProviderData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  hasUsedTrial?: boolean;
  redirectToPayNow?: boolean;
  subscriptionStatus?: string;
  sevaId?: string;
}

export interface IRefreshTokenResponse extends IBaseApiResponse {
  data: {
    access: {
      token: string;
      expires: string; // ISO date string
    };
    refresh: {
      token: string;
      expires: string; // ISO date string
    };
  };
}

export interface IUserLogin {
  phoneNumber: string;
  password: string;
}
