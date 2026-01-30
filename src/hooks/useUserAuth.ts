import {
  providerNPIExistingCheck,
  providerPhoneExistingCheck,
  providerSignup,
  userExistingCheck,
  userLogin,
  userRequestNewApprovalLink,
  userRequestNewPasswordLink,
  userRequestNewPasswordLinkForProvider,
  userSetNewPassword,
  userSignup,
  userVerifyAccount,
} from "@/services/authService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// EmailVerify user
export const useUserNamePhoneVerify = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["user-phone-verify"],
    mutationFn: userExistingCheck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_session"] });
    },
  });
};

// npi user
export const useProviderNPIVerify = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["provider-npi-verify"],
    mutationFn: providerNPIExistingCheck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider_session"] });
    },
  });
};

// provider phone user
export const useProviderPhoneVerify = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["provider-phone-verify"],
    mutationFn: providerPhoneExistingCheck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider_Phone_session"] });
    },
  });
};

//Hook to request new password link
export const useUserRequestNewPasswordLink = () => {
  return useMutation({
    mutationKey: ["request-new-password-link"],
    mutationFn: userRequestNewPasswordLink,
    onSuccess: (data) => {
      console.log("request new password link sent successfully:", data);
    },
  });
};

//Hook to request new password link
export const useProviderRequestNewPasswordLink = () => {
  return useMutation({
    mutationKey: ["request-new-provider-password-link"],
    mutationFn: userRequestNewPasswordLinkForProvider,
    onSuccess: (data) => {
      console.log("request new provider password link sent successfully:", data);
    },
  });
};

//Hook to set new password link
export const useUserSetNewPassword = () => {
  return useMutation({
    mutationKey: ["set-new-password"],
    mutationFn: userSetNewPassword,
    onSuccess: (data) => {
      console.log("set new password successfully:", data);
    },
  });
};

// Create a user
export const useUserSignup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["userSignup"],
    mutationFn: userSignup,
    onSuccess: (data) => {
      console.log("User signed up successfully:", data);

      // Invalidate session queries if needed
      queryClient.invalidateQueries({ queryKey: ["user_session"] });
    },
  });
};

// Create a provider
export const useProviderSignup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["providerSignup"],
    mutationFn: providerSignup,
    onSuccess: (data) => {
      console.log("Provider signed up successfully:", data);

      // Invalidate session queries if needed
      queryClient.invalidateQueries({ queryKey: ["provider_session"] });
    },
  });
};

//Hook to request new approval link
export const useUserRequesNewApprovalLink = () => {
  return useMutation({
    mutationKey: ["request-new-approval-link"],
    mutationFn: userRequestNewApprovalLink,
    onSuccess: (data) => {
      console.log("request new approval link sent successfully:", data);
    },
  });
};

//Hook to verify user account
export const useUserVerifyAccount = () => {
  return useMutation({
    mutationKey: ["verify-account"],
    mutationFn: userVerifyAccount,
    onSuccess: (data) => {
      console.log("request for verify user account:", data);
    },
  });
};

// Login user
export const useUserSignin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["userLogin"],
    mutationFn: userLogin,
    onSuccess: (data) => {
      console.log("login success", data);
      queryClient.invalidateQueries({ queryKey: ["user_session"] });
    },
  });
};
