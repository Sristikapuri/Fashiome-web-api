import axiosInstance from "./axios-instance";
import { API } from "./endpoints";
export { uploadPhoto } from "./dashboard";

export const fetchDashboardData = async (token: string) => {
  try {
    const response = await axiosInstance.get(API.HOME.DASHBOARD, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: response.data.isSuccess,
      message: response.data.responseMessage,
      data: response.data.responseData,
    };
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.responseMessage || "Failed to load dashboard"
    );
  }
};

export const getWardrobe = async (token: string) => {
  try {
    const response = await axiosInstance.get(API.HOME.WARDROBE, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: response.data.isSuccess,
      message: response.data.responseMessage,
      data: response.data.responseData,
    };
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.responseMessage || "Failed to load wardrobe"
    );
  }
};

export const addWardrobeItem = async (data: Record<string, any>, token: string) => {
  try {
    const response = await axiosInstance.post(API.HOME.WARDROBE, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      success: response.data.isSuccess,
      message: response.data.responseMessage,
      data: response.data.responseData,
    };
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.responseMessage || "Failed to add wardrobe item"
    );
  }
};

export const deleteWardrobeItem = async (itemId: string, token: string) => {
  try {
    const response = await axiosInstance.delete(API.HOME.WARDROBE_ITEM(itemId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: response.data.isSuccess,
      message: response.data.responseMessage,
      data: response.data.responseData,
    };
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.responseMessage || "Failed to delete item"
    );
  }
};

export const sendAssistantChat = async (payload: any, token: string) => {
  try {
    const response = await axiosInstance.post(API.HOME.CHAT, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: response.data.isSuccess,
      message: response.data.responseMessage,
      data: response.data.responseData, // expecting recommendation object
    };
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.responseMessage || "Failed to send chat"
    );
  }
};

export const generateOutfit = async (payload: any, token: string) => {
  try {
    const response = await axiosInstance.post(API.HOME.RECOMMEND, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: response.data.isSuccess,
      message: response.data.responseMessage,
      data: response.data.responseData, // expecting recommendation
    };
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.responseMessage || "Failed to generate outfit"
    );
  }
};

export const getStyleArchive = async (token: string) => {
  try {
    const response = await axiosInstance.get("/api/v1/users/style-archive", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: response.data.isSuccess,
      message: response.data.responseMessage,
      data: response.data.responseData,
    };
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.responseMessage || "Failed to load style archive"
    );
  }
};

export const saveStyleArchiveEntry = async (payload: any, token: string) => {
  try {
    const response = await axiosInstance.post("/api/v1/users/style-archive", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: response.data.isSuccess,
      message: response.data.responseMessage,
      data: response.data.responseData,
    };
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.responseMessage || "Failed to save style archive"
    );
  }
};

export const fetchTrends = async (token: string) => {
  try {
    const response = await axiosInstance.get(API.HOME.TRENDS, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: response.data.isSuccess,
      message: response.data.responseMessage,
      data: response.data.responseData,
    };
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.responseMessage || "Failed to load trends"
    );
  }
};

export const updateWardrobeItem = async (itemId: string, payload: any, token: string) => {
  try {
    const response = await axiosInstance.patch(API.HOME.WARDROBE_ITEM(itemId), payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: response.data.isSuccess,
      message: response.data.responseMessage,
      data: response.data.responseData,
    };
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.responseMessage || "Failed to update item"
    );
  }
};
