import { postJsonData } from "@/services/apiServices";
import { useMutation, type MutationKey } from "@tanstack/react-query";

export const usePostJson = (mutationKey: MutationKey) => {
  return useMutation({
    mutationKey,
    mutationFn: ({ endpoint, data }: { endpoint: string; data: object }) =>
      postJsonData(endpoint, data),

    onSuccess: (data) => {
      console.log("POST success:", data);
    },

    onError: (error) => {
      console.error("POST error:", error);
    },
  });
};
