import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const getSilhouetteProfile = async (token: string) => {
  try {
    const response = await axiosInstance.get(API.SILHOUETTE.PROFILE, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const apiResponse = response.data;
    return {
      success: apiResponse.isSuccess,
      message: apiResponse.responseMessage,
      data: apiResponse.responseData,
    };
  } catch (error: any) {
    throw new Error(error?.response?.data?.responseMessage || "Failed to fetch silhouette profile");
  }
};

export const saveSilhouetteProfile = async (profileData: any, token: string) => {
  try {
    const response = await axiosInstance.post(API.SILHOUETTE.PROFILE, profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const apiResponse = response.data;
    return {
      success: apiResponse.isSuccess,
      message: apiResponse.responseMessage,
      data: apiResponse.responseData,
    };
  } catch (error: any) {
    throw new Error(error?.response?.data?.responseMessage || "Failed to save silhouette profile");
  }
};

export const clearSilhouetteProfile = async (token: string) => {
  try {
    const response = await axiosInstance.delete(API.SILHOUETTE.PROFILE, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const apiResponse = response.data;
    return {
      success: apiResponse.isSuccess,
      message: apiResponse.responseMessage,
      data: apiResponse.responseData,
    };
  } catch (error: any) {
    throw new Error(error?.response?.data?.responseMessage || "Failed to clear silhouette profile");
  }
};
