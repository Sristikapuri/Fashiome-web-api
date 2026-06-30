import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const getMyOrders = async (token: string) => {
  try {
    const response = await axiosInstance.get(API.ORDERS.MINE, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const apiResponse = response.data;
    const responseData = apiResponse?.responseData ?? apiResponse?.data ?? apiResponse;

    return {
      success: apiResponse?.isSuccess ?? true,
      message: apiResponse?.responseMessage ?? apiResponse?.message ?? "",
      data: responseData,
    };
  } catch (error: any) {
    throw new Error(error?.response?.data?.responseMessage || "Failed to fetch orders");
  }
};
