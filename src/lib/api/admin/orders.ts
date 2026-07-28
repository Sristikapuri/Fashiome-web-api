import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export interface AdminOrder {
  _id: string;
  userId: string;
  customerDisplayName: string;
  customerName?: string;
  customerEmail?: string;
  phone?: string;
  city?: string;
  postalCode?: string;
  shippingAddress: string;
  paymentMethod: string;
  esewaTransactionId?: string;
  esewaRefId?: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  items: {
    clotheId: string;
    name: string;
    imageUrl: string;
    quantity: number;
    price: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  paidOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  esewaOrders: number;
  codOrders: number;
}

export const getAllOrders = async (
  params: { page?: number; limit?: number; status?: string; paymentMethod?: string },
  token: string
) => {
  const response = await axiosInstance.get(API.ADMIN.ORDERS, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return {
    data: response.data.responseData.data as AdminOrder[],
    meta: response.data.responseData.meta,
    success: response.data.isSuccess,
  };
};

export const updateOrderStatus = async (id: string, status: OrderStatus, token: string) => {
  const response = await axiosInstance.patch(
    API.ADMIN.ORDER_STATUS(id),
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return {
    success: response.data.isSuccess,
    data: response.data.responseData as AdminOrder,
  };
};

export const deleteOrder = async (id: string, token: string) => {
  const response = await axiosInstance.delete(API.ADMIN.ORDER_BY_ID(id), {
    headers: { Authorization: `Bearer ${token}` },
  });
  return {
    success: response.data.isSuccess,
  };
};

export const getOrderStats = async (token: string) => {
  const response = await axiosInstance.get(API.ADMIN.ORDER_STATS, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return {
    success: response.data.isSuccess,
    data: response.data.responseData as OrderStats,
  };
};

export const getLowStockItems = async (token: string, threshold = 5) => {
  const response = await axiosInstance.get(API.ADMIN.LOW_STOCK, {
    headers: { Authorization: `Bearer ${token}` },
    params: { threshold },
  });
  return {
    success: response.data.isSuccess,
    data: response.data.responseData as any[],
  };
};
