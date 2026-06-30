import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const getHomeDashboard = async (token: string) => {
  try {
    const response = await axiosInstance.get(API.HOME.DASHBOARD, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.responseMessage || "Failed to fetch dashboard");
  }
};

export const getWardrobe = async (token: string) => {
  try {
    const response = await axiosInstance.get(API.HOME.WARDROBE, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.responseMessage || "Failed to fetch wardrobe");
  }
};

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

export const addWardrobeItem = async (itemData: any, token: string) => {
  try {
    const response = await axiosInstance.post(API.HOME.WARDROBE, itemData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.responseMessage || "Failed to add wardrobe item");
  }
};

export const deleteWardrobeItem = async (itemId: string, token: string) => {
  try {
    const response = await axiosInstance.delete(API.HOME.WARDROBE_ITEM(itemId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.responseMessage || "Failed to delete wardrobe item");
  }
};

export const sendChatAssistantMessage = async (message: string, history: any[], token: string) => {
  try {
    const response = await axiosInstance.post(API.HOME.CHAT, { message, history }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.responseMessage || "Failed to send chat message");
  }
};

export const generateOutfitRecommendation = async (occasion: string, token: string) => {
  try {
    const response = await axiosInstance.post(API.HOME.RECOMMEND, { occasion }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.responseMessage || "Failed to generate recommendation");
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
