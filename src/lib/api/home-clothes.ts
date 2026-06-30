"use server";

import axios from "axios";
import { API } from "./endpoints";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

export interface HomeClothe {
  _id: string;
  name: string;
  category: "tops" | "bottoms" | "shoes" | "accessories";
  size: string;
  color: string;
  price: number;
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

export interface BackendResponse<T> {
  statusCode: number;
  isSuccess: boolean;
  responseMessage: string;
  responseData: T;
  paginationMeta?: PaginationMeta;
  timestamp: string;
}

export async function getHomeClothes(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}) {
  const response = await axios.get<BackendResponse<{ data: HomeClothe[]; meta: PaginationMeta }>>(
    `${BASE_URL}${API.HOME.CLOTHES}`,
    {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 12,
        ...(params.search ? { search: params.search } : {}),
        ...(params.category ? { category: params.category } : {}),
      },
    }
  );

  return response.data;
}
