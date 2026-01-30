import type { IUserLogin } from "@/interfaces/auth.interfaces";
import { axiosInst } from "@/utils/apiClient";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";

// Function to make a POST request with JSON data for authentication.
export const authenticationPOST = async (endpoint: string, data?: object) => {
  try {
    const response = await axiosInst.post(endpoint, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting JSON data:", error);
    throw error;
  }
};

// Function to register a new user
export const userSignup = async (payload: any) => {
  const resp = await authenticationPOST(apiRoutes.signup, payload);
  return resp;
};

// Function to register a new user
export const providerSignup = async (payload: any) => {
  const resp = await authenticationPOST(apiRoutes.providerSignup, payload);
  return resp;
};

// Function to check exisiting user
export const userExistingCheck = async (payload: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}) => {
  const { data } = await authenticationPOST(
    apiRoutes.existingUserCheck,
    payload,
  );
  return data;
};

// Function to rest new password link
export const userRequestNewPasswordLink = async (payload: {
  // firstName: string;
  // lastName: string;
  phoneNumber: string;
}) => {
  const resp = await authenticationPOST(
    apiRoutes.requestNewPasswordLink,
    payload,
  );
  return resp;
};

// Function to rest new password link
export const userRequestNewPasswordLinkForProvider = async (payload: {
  phoneNumber: string;
}) => {
  const resp = await authenticationPOST(
    apiRoutes.requestNewPasswordLinkForProvider,
    payload,
  );
  return resp;
};

// Function to set new password
export const userSetNewPassword = async (data: {
  password: string;
  confirmPassword: string;
  token: string;
}) => {
  const { token, ...payload } = data;
  const url = `${apiRoutes.setNewPassword}?token=${encodeURIComponent(token)}`;
  const resp = await authenticationPOST(url, payload);
  return resp;
};

// Function to rest new password link
export const userRequestNewApprovalLink = async (payload: {
  phoneNumber: string;
}) => {
  const resp = await authenticationPOST(
    apiRoutes.requestNewApprovalLink,
    payload,
  );
  return resp;
};

// Function to rest new password link
export const userVerifyAccount = async (token: string) => {
  const url = `${apiRoutes.userVerifyAccount}?token=${encodeURIComponent(
    token,
  )}`;
  const resp = await authenticationPOST(url);
  return resp;
};

// Function to login
export const userLogin = async (auth: IUserLogin) => {
  const resp = await authenticationPOST(apiRoutes.login, auth);
  return resp;
};

// Function to check exisiting prpovider npi
export const providerNPIExistingCheck = async (payload: { npi: string }) => {
  const data = await authenticationPOST(
    apiRoutes.existingNPIProviderCheck,
    payload,
  );
  return data;
};

// Function to check exisiting prpovider npi
export const providerPhoneExistingCheck = async (payload: { phoneNumber: string }) => {
  const data = await authenticationPOST(
    apiRoutes.existingProviderPhoneCheck,
    payload,
  );
  return data;
};
