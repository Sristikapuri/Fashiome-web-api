"use server";

import { getTokenCookie } from "@/lib/cookies";
import { createOrder, getOrderById, type CreateOrderInput } from "@/lib/api/order";
import { getMyOrders } from "@/lib/api/orders";

export const handleCreateOrder = async (data: CreateOrderInput) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }

    const result = await createOrder(token, data);
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to place order",
      data: null,
    };
  }
};

export const handleGetOrderById = async (id: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }

    const result = await getOrderById(token, id);
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch order",
      data: null,
    };
  }
};

export const handleGetMyOrders = async () => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }

    return await getMyOrders(token);
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to load orders",
      data: null,
    };
  }
};
