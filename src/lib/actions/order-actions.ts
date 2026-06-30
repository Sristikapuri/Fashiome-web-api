"use server";

import { getTokenCookie } from "@/lib/cookies";
import { getMyOrders } from "@/lib/api/orders";

export const handleGetMyOrders = async () => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }

    const result = await getMyOrders(token);
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to load orders",
      data: null,
    };
  }
};
