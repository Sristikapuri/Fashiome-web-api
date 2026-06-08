import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const register = async (data: any) => {
  try {
    const response = await axiosInstance.post(API.AUTH.REGISTER, data);
    const apiResponse = response.data;
    return {
      success: apiResponse.isSuccess,
      message: apiResponse.responseMessage,
      data: apiResponse.responseData
    };
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.responseMessage || "Registration failed"
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
      data: apiResponse.responseData
    };
  } catch (error: Error | any) {
    throw new Error(error?.response?.data?.responseMessage || "Login failed");
  }
};
