"use server";

import axios from "axios";
import { getTokenCookie } from "@/lib/cookies";
import { API } from "../endpoints";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

export interface AdminClothe {
  _id: string;
  name: string;
  category:
    | "tops"
    | "bottoms"
    | "shoes"
    | "accessories"
    | "dresses"
    | "outerwear"
    | "shirts"
    | "sweaters"
    | "pants"
    | "skirts"
    | "activewear";
  size: string;
  color: string;
  price: number;
  discountedPrice?: number | null;
  stock: number;
  imageUrl?: string;
  description?: string;
  status?: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ClothesListPayload {
  data: AdminClothe[];
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

export type CreateClotheInput = Omit<AdminClothe, "_id" | "createdAt" | "updatedAt">;
export type UpdateClotheInput = Partial<CreateClotheInput>;

export type ClothesFormPayload = {
  name: string;
  category:
    | "tops"
    | "bottoms"
    | "shoes"
    | "accessories"
    | "dresses"
    | "outerwear"
    | "shirts"
    | "sweaters"
    | "pants"
    | "skirts"
    | "activewear";
  size: string;
  color: string;
  price: number;
  discountedPrice?: number | null;
  stock: number;
  imageUrl?: string;
  description?: string;
  status: "active" | "inactive";
  imageFile?: File | null;
};

export async function getAllClothes(params: { page?: number; limit?: number; search?: string; category?: string; status?: string }) {
  const headers = await withAuthHeaders();
  const response = await axios.get<BackendResponse<ClothesListPayload>>(
    `${BASE_URL}${API.ADMIN.CLOTHES}`,
    {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        ...(params.search ? { search: params.search } : {}),
        ...(params.category ? { category: params.category } : {}),
        ...(params.status ? { status: params.status } : {}),
      },
      headers,
    }
  );

  return response.data;
}

export async function getClotheById(id: string) {
  const headers = await withAuthHeaders();
  const response = await axios.get<BackendResponse<AdminClothe>>(
    `${BASE_URL}${API.ADMIN.CLOTH_BY_ID(id)}`,
    { headers }
  );
  return response.data;
}

export async function createClothe(data: CreateClotheInput | FormData) {
  const headers = data instanceof FormData ? await withAuthHeaders() : await withAuthHeaders("application/json");
  const response = await axios.post<BackendResponse<AdminClothe>>(
    `${BASE_URL}${API.ADMIN.CLOTHES}`,
    data,
    { headers }
  );
  return response.data;
}

export async function updateClothe(id: string, data: UpdateClotheInput | FormData) {
  const headers = await withAuthHeaders(data instanceof FormData ? undefined : "application/json");
  const response = await axios.put<BackendResponse<AdminClothe>>(
    `${BASE_URL}${API.ADMIN.CLOTH_BY_ID(id)}`,
    data,
    { headers }
  );
  return response.data;
}

export async function deleteClothe(id: string) {
  const headers = await withAuthHeaders();
  const response = await axios.delete<BackendResponse<null>>(
    `${BASE_URL}${API.ADMIN.CLOTH_BY_ID(id)}`,
    { headers }
  );
  return response.data;
}
