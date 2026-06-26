import "server-only";

import axios from "axios";
import { getTokenCookie } from "@/lib/cookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  gender: string;
  age: number;
  role: string;
  status?: "active" | "inactive";
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsersListPayload {
  data: AdminUser[];
  meta: PaginationMeta;
}

export interface BackendResponse<T> {
  statusCode: number;
  isSuccess: boolean;
  responseMessage: string;
  responseData: T;
  paginationMeta?: PaginationMeta;
  timestamp: string;
}

export interface CreateAdminUserInput {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  gender: string;
  age: number;
  role: string;
  status?: "active" | "inactive";
}

export interface UpdateAdminUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  gender?: string;
  age?: number;
  role?: string;
  status?: "active" | "inactive";
  profileImage?: string;
}

async function withAuthHeaders(contentType?: string) {
  const token = await getTokenCookie();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  return headers;
}

export async function getAllUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const headers = await withAuthHeaders();
  const response = await axios.get<BackendResponse<UsersListPayload>>(
    `${BASE_URL}/api/v1/admin/users`,
    {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        ...(params.search ? { search: params.search } : {}),
      },
      headers,
    }
  );

  return response.data;
}

export async function getUserById(id: string) {
  const headers = await withAuthHeaders();
  const response = await axios.get<BackendResponse<AdminUser>>(
    `${BASE_URL}/api/v1/admin/users/${id}`,
    { headers }
  );

  return response.data;
}

export async function createUser(data: CreateAdminUserInput) {
  const headers = await withAuthHeaders("application/json");
  const response = await axios.post<BackendResponse<AdminUser>>(
    `${BASE_URL}/api/v1/admin/users`,
    data,
    { headers }
  );

  return response.data;
}

export async function updateUser(id: string, data: UpdateAdminUserInput | FormData) {
  const headers = await withAuthHeaders(data instanceof FormData ? undefined : "application/json");
  const response = await axios.put<BackendResponse<AdminUser>>(
    `${BASE_URL}/api/v1/admin/users/${id}`,
    data,
    { headers }
  );

  return response.data;
}

export async function deleteUser(id: string) {
  const headers = await withAuthHeaders();
  const response = await axios.delete<BackendResponse<null>>(
    `${BASE_URL}/api/v1/admin/users/${id}`,
    { headers }
  );

  return response.data;
}
