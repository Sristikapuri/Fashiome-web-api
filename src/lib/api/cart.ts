import axiosInstance from "./axios-instance";
import { getApiBaseUrl } from "./base-url";

const BASE_URL = getApiBaseUrl();

export interface CartItem {
  clotheId: string;
  quantity: number;
}

export interface HydratedCartItem {
  clotheId?: string;
  clothe?: Record<string, unknown>;
  quantity: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: HydratedCartItem[];
  createdAt: string;
  updatedAt: string;
}

export async function getCart(token: string) {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/api/v1/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const apiResponse = response.data;
    return {
      success: apiResponse?.isSuccess ?? true,
      message: apiResponse?.responseMessage ?? "",
      data: apiResponse?.responseData ?? apiResponse?.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.responseMessage || "Failed to fetch cart",
      data: null,
    };
  }
}

export async function setCart(token: string, items: CartItem[]) {
  try {
    const response = await axiosInstance.put(
      `${BASE_URL}/api/v1/cart`,
      { items },
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
      message: error?.response?.data?.responseMessage || "Failed to update cart",
      data: null,
    };
  }
}
