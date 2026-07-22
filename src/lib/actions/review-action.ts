"use server";

import { getTokenCookie } from "@/lib/cookies";
import { createReview, getReviewsByClothe, getMyReviews, updateReview, deleteReview } from "@/lib/api/reviews";

export const handleCreateReview = async (data: {
  clotheId: string;
  rating: number;
  title?: string;
  comment: string;
}) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }

    const result = await createReview(token, data);
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to create review",
      data: null,
    };
  }
};

export const handleGetReviewsByClothe = async (clotheId: string) => {
  try {
    const result = await getReviewsByClothe(clotheId);
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch reviews",
      data: null,
    };
  }
};

export const handleGetMyReviews = async () => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }

    const result = await getMyReviews(token);
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch reviews",
      data: null,
    };
  }
};

export const handleUpdateReview = async (id: string, data: {
  rating?: number;
  title?: string;
  comment?: string;
}) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }

    const result = await updateReview(token, id, data);
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update review",
      data: null,
    };
  }
};

export const handleDeleteReview = async (id: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }

    const result = await deleteReview(token, id);
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to delete review",
      data: null,
    };
  }
};
