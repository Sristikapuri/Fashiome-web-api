import axiosInstance from "./axios-instance";
import { getApiBaseUrl } from "./base-url";

const BASE_URL = getApiBaseUrl();

export interface Review {
  _id: string;
  userId: string;
  clotheId: string;
  rating: number;
  title?: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

export async function createReview(token: string, data: {
  clotheId: string;
  rating: number;
  title?: string;
  comment: string;
}) {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/api/v1/reviews`,
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
      message: error?.response?.data?.responseMessage || "Failed to create review",
      data: null,
    };
  }
}

export async function getReviewsByClothe(clotheId: string) {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/api/v1/reviews/clothe/${clotheId}`
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
      message: error?.response?.data?.responseMessage || "Failed to fetch reviews",
      data: null,
    };
  }
}

export async function getMyReviews(token: string) {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/api/v1/reviews/my`,
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
      message: error?.response?.data?.responseMessage || "Failed to fetch reviews",
      data: null,
    };
  }
}

export async function updateReview(token: string, id: string, data: {
  rating?: number;
  title?: string;
  comment?: string;
}) {
  try {
    const response = await axiosInstance.put(
      `${BASE_URL}/api/v1/reviews/${id}`,
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
      message: error?.response?.data?.responseMessage || "Failed to update review",
      data: null,
    };
  }
}

export async function deleteReview(token: string, id: string) {
  try {
    const response = await axiosInstance.delete(
      `${BASE_URL}/api/v1/reviews/${id}`,
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
      message: error?.response?.data?.responseMessage || "Failed to delete review",
      data: null,
    };
  }
}
