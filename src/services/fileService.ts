import { apiClient } from "@/utils/apiClient";

export const uploadFile = async (
  path: string,
  file: File,
  extraData?: Record<string, string>
) => {
  const formData = new FormData();
  formData.append("file", file); // use "file" or backend's expected key

  // Append additional data if provided (e.g., carId)
  if (extraData) {
    Object.entries(extraData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const response = await apiClient.post(path, formData);
  return response;
};
