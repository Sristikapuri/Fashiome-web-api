"use server";

import { revalidatePath } from "next/cache";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  type CreateAdminUserInput,
  type UpdateAdminUserInput,
} from "@/lib/api/admin/user";

export const handleGetAllUsers = async ({
  page,
  limit,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const result = await getAllUsers({
      page: page && page > 0 ? page : 1,
      limit: limit && limit > 0 ? limit : 10,
      search: search?.trim() || undefined,
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
      message: error?.response?.data?.responseMessage || error?.message || "Failed to fetch users",
    };
  }
};

export const handleGetUserById = async (id: string) => {
  try {
    const result = await getUserById(id);
    return {
      success: result.isSuccess,
      message: result.responseMessage,
      data: result.responseData,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.responseMessage || error?.message || "Failed to fetch user",
    };
  }
};

export const handleCreateUser = async (data: CreateAdminUserInput) => {
  try {
    const result = await createUser(data);

    if (result.isSuccess) {
      revalidatePath("/dashboard/admin/users");
      revalidatePath("/dashboard/admin");
    }

    return {
      success: result.isSuccess,
      message: result.responseMessage,
      data: result.responseData,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.responseMessage || error?.message || "Failed to create user",
    };
  }
};

export const handleUpdateUser = async (id: string, data: UpdateAdminUserInput | FormData) => {
  try {
    const result = await updateUser(id, data);

    if (result.isSuccess) {
      revalidatePath("/dashboard/admin/users");
      revalidatePath(`/dashboard/admin/users/${id}`);
    }

    return {
      success: result.isSuccess,
      message: result.responseMessage,
      data: result.responseData,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.responseMessage || error?.message || "Failed to update user",
    };
  }
};

export const handleDeleteUser = async (id: string) => {
  try {
    const result = await deleteUser(id);

    if (result.isSuccess) {
      revalidatePath("/dashboard/admin/users");
      revalidatePath("/dashboard/admin");
    }

    return {
      success: result.isSuccess,
      message: result.responseMessage,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.responseMessage || error?.message || "Failed to delete user",
    };
  }
};
