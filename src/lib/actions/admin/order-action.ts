"use server";

import { revalidatePath } from "next/cache";
import { getTokenCookie } from "@/lib/cookies";
import {
  getAllOrders,
  getOrderStats,
  getLowStockItems,
  updateOrderStatus,
  type OrderStatus,
} from "@/lib/api/admin/orders";

export const handleGetAllOrders = async (params: {
  page?: number;
  limit?: number;
  status?: string;
  paymentMethod?: string;
}) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized", data: null, meta: null };
    const result = await getAllOrders(params, token);
    return { success: result.success, data: result.data, meta: result.meta, message: "" };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch orders", data: null, meta: null };
  }
};

export const handleGetOrderStats = async () => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, data: null };
    const result = await getOrderStats(token);
    return { success: result.success, data: result.data };
  } catch (error: any) {
    return { success: false, data: null };
  }
};

export const handleGetLowStockItems = async (threshold = 5) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, data: [] };
    const result = await getLowStockItems(token, threshold);
    return { success: result.success, data: result.data ?? [] };
  } catch (error: any) {
    return { success: false, data: [] };
  }
};

export const handleUpdateOrderStatus = async (id: string, status: OrderStatus) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized" };
    const result = await updateOrderStatus(id, status, token);
    if (result.success) {
      revalidatePath("/dashboard/admin/orders");
      revalidatePath("/dashboard/admin");
    }
    return { success: result.success, data: result.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update status" };
  }
};
