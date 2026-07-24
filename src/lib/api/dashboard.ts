import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const uploadPhoto = async (formData: FormData, token: string) => {
  try {
    const response = await axiosInstance.post("/api/v1/upload/upload-photo", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    const apiResponse = response.data;
    return {
      success: apiResponse?.isSuccess ?? true,
      message: apiResponse?.responseMessage ?? "",
      data: apiResponse?.responseData ?? apiResponse?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error?.response?.data?.responseMessage || "Failed to upload photo");
  }
};

export const generateProfile = async (
  payload: {
    profileData?: any;
    imageReference?: string;
    occasion?: string;
    preferenceScores?: Record<string, number>;
    source?: string;
  },
  token: string
) => {
  try {
    const response = await axiosInstance.post(API.HOME.GENERATE_PROFILE, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const apiResponse = response.data;
    return {
      success: apiResponse?.isSuccess ?? true,
      message: apiResponse?.responseMessage ?? "",
      data: apiResponse?.responseData ?? apiResponse?.data ?? null,
    };
  } catch (error: any) {
    throw new Error(error?.response?.data?.responseMessage || "Failed to generate profile");
  }
};
