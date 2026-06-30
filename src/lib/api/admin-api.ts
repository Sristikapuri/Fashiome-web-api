import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const fetchUsers = async (page: number = 1, limit: number = 10, search: string = "", token: string) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.USERS, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, limit, search },
    });
    return {
      success: response.data.isSuccess,
      message: response.data.responseMessage,
      data: response.data.responseData.data,
      meta: response.data.responseData.meta,
    };
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.responseMessage || "Failed to fetch users"
    );
  }
};

export const fetchUserById = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.USER_BY_ID(id), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: response.data.isSuccess,
      message: response.data.responseMessage,
      data: response.data.responseData,
    };
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.responseMessage || "Failed to fetch user"
    );
  }
};

export const createUser = async (userData: any, token: string) => {
  try {
    const response = await axiosInstance.post(API.ADMIN.USERS, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: response.data.isSuccess,
      message: response.data.responseMessage,
      data: response.data.responseData,
    };
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.responseMessage || "Failed to create user"
    );
  }
};

export const updateUser = async (id: string, userData: any, token: string) => {
  try {
    const response = await axiosInstance.put(API.ADMIN.USER_BY_ID(id), userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: response.data.isSuccess,
      message: response.data.responseMessage,
      data: response.data.responseData,
    };
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.responseMessage || "Failed to update user"
    );
  }
};

export const deleteUser = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.delete(API.ADMIN.USER_BY_ID(id), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: response.data.isSuccess,
      message: response.data.responseMessage,
      data: response.data.responseData,
    };
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.responseMessage || "Failed to delete user"
    );
  }
};
