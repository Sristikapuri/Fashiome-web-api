"use server";

import { getHomeClothes } from "@/lib/api/home-clothes";

export const handleGetHomeClothes = async ({
  page,
  limit,
  search,
  category,
}: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}) => {
  try {
    const result = await getHomeClothes({
      page: page && page > 0 ? page : 1,
      limit: limit && limit > 0 ? limit : 12,
      search: search?.trim() || undefined,
      category: category?.trim() || undefined,
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
      data: null,
    };
  }
};
