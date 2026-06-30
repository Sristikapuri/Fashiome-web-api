"use server";

import { revalidatePath } from "next/cache";
import {
  createClothe,
  deleteClothe,
  getAllClothes,
  getClotheById,
  updateClothe,
  type CreateClotheInput,
  type UpdateClotheInput,
} from "@/lib/api/admin/clothes";

export const handleGetAllClothes = async ({
  page,
  limit,
  search,
  category,
  status,
}: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}) => {
  try {
    const result = await getAllClothes({
      page: page && page > 0 ? page : 1,
      limit: limit && limit > 0 ? limit : 10,
      search: search?.trim() || undefined,
      category: category?.trim() || undefined,
      status: status?.trim() || undefined,
    });

    const payload = result.responseData;
    return {
      success: result.isSuccess,
      message: result.responseMessage,
      data: payload.data,
      pagination: payload.meta ?? result.paginationMeta,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.responseMessage || error?.message || "Failed to fetch clothes",
    };
  }
};

export const handleGetClotheById = async (id: string) => {
  try {
    const result = await getClotheById(id);
    return {
      success: result.isSuccess,
      message: result.responseMessage,
      data: result.responseData,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.responseMessage || error?.message || "Failed to fetch clothes item",
    };
  }
};

export const handleCreateClothe = async (data: CreateClotheInput | FormData) => {
  try {
    const result = await createClothe(data);
    if (result.isSuccess) {
      revalidatePath("/dashboard/admin/clothes");
      revalidatePath("/dashboard/admin");
    }
    return {
      success: result.isSuccess,
      message: result.responseMessage,
      data: result.responseData,
    };
  } catch (error: any) {
    const errorDetails = error?.response?.data?.responseData?.errors;
    const msg = errorDetails && Array.isArray(errorDetails)
      ? `Validation failed: ${errorDetails.map((e: any) => `${e.field} - ${e.message}`).join(', ')}`
      : error?.response?.data?.responseMessage || error?.message || "Failed to create clothes item";
    return {
      success: false,
      message: msg,
    };
  }
};

export const handleUpdateClothe = async (id: string, data: UpdateClotheInput | FormData) => {
  try {
    const result = await updateClothe(id, data);
    if (result.isSuccess) {
      revalidatePath("/dashboard/admin/clothes");
      revalidatePath(`/dashboard/admin/clothes/${id}`);
    }
    return {
      success: result.isSuccess,
      message: result.responseMessage,
      data: result.responseData,
    };
  } catch (error: any) {
    const errorDetails = error?.response?.data?.responseData?.errors;
    const msg = errorDetails && Array.isArray(errorDetails)
      ? `Validation failed: ${errorDetails.map((e: any) => `${e.field} - ${e.message}`).join(', ')}`
      : error?.response?.data?.responseMessage || error?.message || "Failed to update clothes item";
    return {
      success: false,
      message: msg,
    };
  }
};

export const handleDeleteClothe = async (id: string) => {
  try {
    const result = await deleteClothe(id);
    if (result.isSuccess) {
      revalidatePath("/dashboard/admin/clothes");
      revalidatePath("/dashboard/admin");
    }
    return {
      success: result.isSuccess,
      message: result.responseMessage,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.responseMessage || error?.message || "Failed to delete clothes item",
    };
  }
};
