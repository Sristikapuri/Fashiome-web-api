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