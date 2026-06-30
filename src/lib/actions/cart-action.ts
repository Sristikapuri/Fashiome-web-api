"use server";

import { getTokenCookie } from "@/lib/cookies";
import { getCart, setCart } from "@/lib/api/cart";

export const handleGetCart = async () => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }

    const result = await getCart(token);
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to load cart",
      data: null,
    };
  }
};

export const handleSetCart = async (items: any[]) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }

    const result = await setCart(token, items);
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update cart",
      data: null,
    };
  }
};
