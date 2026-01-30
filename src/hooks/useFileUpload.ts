import { uploadFile } from "@/services/fileService";
import { useMutation, type MutationKey } from "@tanstack/react-query";

/**
 * Hook to upload a file dynamically to any endpoint
 */
export const useFileUpload = (mutationKey: MutationKey) => {
  return useMutation({
    mutationKey,
    mutationFn: ({
      path,
      file,
      extraData,
    }: {
      path: string;
      file: File;
      extraData?: Record<string, string>;
    }) => uploadFile(path, file, extraData),
    onSuccess: () => {
    //   console.log("File uploaded successfully:", data);
    },
    onError: (error) => {
      console.error("File upload failed:", error);
    },
  });
};
