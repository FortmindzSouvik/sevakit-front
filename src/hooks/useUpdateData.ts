import { patchJsonData } from "@/services/apiServices";
import { useMutation, type MutationKey } from "@tanstack/react-query";

const useUpdateData = (mutationKey: MutationKey) => {
  return useMutation({
    mutationKey,
    mutationFn: ({ endpoint, data }: { endpoint: string; data: object }) =>
      patchJsonData(endpoint, data),
    onSuccess: (data) => {
      console.log("patch success", data);
    },
    onError: (error) => {
      console.error("patch error :", error);
    },
  });
};

export default useUpdateData;
