"use server";

import { getTokenCookie } from "@/lib/cookies";
import { getEsewaPaymentUrl, verifyEsewaPayment } from "@/lib/api/esewa";

export const handleGetEsewaPaymentUrl = async (data: {
  amount: number;
  orderId: string;
  productCode?: string;
}) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }

    const result = await getEsewaPaymentUrl(token, data);
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to generate payment URL",
      data: null,
    };
  }
};

export const handleVerifyEsewaPayment = async (data: {
  amount: number;
  orderId: string;
  refId: string;
  data?: string;
}) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }

    const result = await verifyEsewaPayment(token, data);
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to verify payment",
      data: null,
    };
  }
};
