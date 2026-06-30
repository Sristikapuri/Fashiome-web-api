import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

export interface OrderItem {
  clotheId: string;
  quantity: number;
  price: number;
  name?: string;
  imageUrl?: string;
  category?: string;
  size?: string;
  color?: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: string;
  customerName?: string;
  customerEmail?: string;
  phone?: string;
  city?: string;
  postalCode?: string;
  paymentMethod?: string;
  esewaTransactionId?: string;
  esewaRefId?: string;
  subtotal: number;
  tax: number;
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  shippingAddress: string;
  customerName?: string;
  customerEmail?: string;
  phone?: string;
  city?: string;
  postalCode?: string;
  paymentMethod?: string;
}

export interface EsewaParams {
  paymentUrl: string;
  amount: number;
  tax_amount: number;
  product_service_charge: number;
  product_delivery_charge: number;
  total_amount: number;
  transaction_uuid: string;
  product_code: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

export interface CreateOrderResult {
  success: boolean;
  message: string;
  data: {
    order: Order;
    esewa?: EsewaParams;
  } | Order | null;
}

export async function createOrder(token: string, data: CreateOrderInput): Promise<CreateOrderResult> {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/api/v1/orders`,
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
      message: error?.response?.data?.responseMessage || "Failed to place order",
      data: null,
    };
  }
}

export async function getOrderById(token: string, id: string): Promise<{ success: boolean; message: string; data: Order | null }> {
  try {
    const response = await axiosInstance.get(
      API.ORDERS.BY_ID(id),
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
      message: error?.response?.data?.responseMessage || "Failed to fetch order",
      data: null,
    };
  }
}
