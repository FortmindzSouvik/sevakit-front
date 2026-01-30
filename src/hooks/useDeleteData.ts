// hooks/useDeleteData.ts
import { deleteData } from "@/services/apiServices";
import {
  useMutation,
  type MutationKey,
} from "@tanstack/react-query";

// Typing: <ReturnType, ErrorType, Variables (endpoint), Context>
const useDeleteData = (mutationKey: MutationKey) => {
  return useMutation({
    mutationKey,
    mutationFn: (endpoint: string) => deleteData(endpoint),
    onSuccess: () => {
      console.log("Data deleted");
    },
    onError: (error: any) => {
      console.error("DELETE error :", error);
    },
  });
};

export default useDeleteData;
