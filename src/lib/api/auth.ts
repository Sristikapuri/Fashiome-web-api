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
    const message =
      error?.response?.data?.responseMessage ||
      (error?.response?.data ? JSON.stringify(error?.response?.data) : "") ||
      error?.message ||
      "Login failed";
    throw new Error(message);
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await axiosInstance.post(API.AUTH.FORGOT_PASSWORD, { email });
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
      "Failed to send password reset instructions"
    );
  }
};

export const resetPassword = async (data: {
  email: string;
  token: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post(API.AUTH.RESET_PASSWORD, data);
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
      "Failed to reset password"
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
