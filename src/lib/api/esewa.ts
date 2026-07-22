import axiosInstance from "./axios-instance";
import { getApiBaseUrl } from "./base-url";

const BASE_URL = getApiBaseUrl();

export async function getEsewaPaymentUrl(token: string, data: {
  amount: number;
  orderId: string;
  productCode?: string;
}) {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/api/v1/esewa/payment-url`,
      {
        params: data,
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const apiResponse = response.data;
    return {
      success: apiResponse?.isSuccess ?? true,
      message: apiResponse?.responseMessage ?? "",
      data: apiResponse?.responseData ?? apiResponse?.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.responseMessage || "Failed to generate payment URL",
      data: null,
    };
  }
}

export async function verifyEsewaPayment(token: string, data: {
  amount: number;
  orderId: string;
  refId: string;
  data?: string;
}) {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/api/v1/esewa/verify`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const apiResponse = response.data;
    return {
      success: apiResponse?.isSuccess ?? true,
      message: apiResponse?.responseMessage ?? "",
      data: apiResponse?.responseData ?? apiResponse?.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.responseMessage || "Failed to verify payment",
      data: null,
    };
  }
}
