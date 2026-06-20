import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const register = async (data: any) => {
  try {
    const response = await axiosInstance.post(API.AUTH.REGISTER, data);

    const apiResponse = response.data;

    return {
      success: apiResponse.isSuccess,
      message: apiResponse.responseMessage,
      data: apiResponse.responseData,
    };
  } catch (error: any) {
    // 🔥 IMPORTANT: show full backend error
    console.log("🔥 REGISTER API ERROR:", error?.response?.data);

    throw new Error(
      error?.response?.data?.responseMessage ||
      JSON.stringify(error?.response?.data) ||
      "Registration failed"
    );
  }
};

export const login = async (data: any) => {
  try {
    const response = await axiosInstance.post(API.AUTH.LOGIN, data);

    const apiResponse = response.data;

    return {
      success: apiResponse.isSuccess,
      message: apiResponse.responseMessage,
      data: apiResponse.responseData,
    };
  } catch (error: any) {
    console.log("🔥 LOGIN API ERROR:", error?.response?.data);

    throw new Error(
      error?.response?.data?.responseMessage ||
      JSON.stringify(error?.response?.data) ||
      "Login failed"
    );
  }
};

export const whoami = async (token: string) => {
  try {
    const response = await axiosInstance.get(API.AUTH.WHOAMI, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const apiResponse = response.data;

    return {
      success: apiResponse.isSuccess,
      message: apiResponse.responseMessage,
      data: apiResponse.responseData,
    };
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.responseMessage ||
        JSON.stringify(error?.response?.data) ||
        "Failed to load user"
    );
  }
};

export const updateProfile = async (data: FormData, token: string) => {
  try {
    const response = await axiosInstance.put(API.AUTH.UPDATE, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    const apiResponse = response.data;

    return {
      success: apiResponse.isSuccess,
      message: apiResponse.responseMessage,
      data: apiResponse.responseData,
    };
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.responseMessage ||
        JSON.stringify(error?.response?.data) ||
        "Profile update failed"
    );
  }
};
