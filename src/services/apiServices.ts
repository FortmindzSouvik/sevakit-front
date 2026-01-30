import { apiClient } from "@/utils/apiClient";


export const fetchData = async (endpoint: string) => {
  try {
    const response = await apiClient.get(endpoint);
    return response; 
  } catch (error:any) {
    console.error("Error fetching data:", error);
    throw error; 
  }
};

export const postJsonData = async (endpoint: string, data: object) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response; 
  } catch (error) {
    console.error("Error posting JSON data:", error);
    throw error; 
  }
};


export const putJsonData = async (endpoint: string, data: object) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response; 
  } catch (error) {
    console.error("Error updating JSON data:", error);
    throw error; 
  }
};

export const patchJsonData = async (endpoint: string, data: object) => {
  try {
    const response = await apiClient.patch(endpoint, data);
    return response; 
  } catch (error) {
    console.error("Error patching JSON data:", error);
    throw error;
  }
};

export const deleteData = async (endpoint: string,data?: any) => {
  try {
    const response = await apiClient.delete(endpoint,{
      data
    });
    return response; 
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error; 
  }
};
