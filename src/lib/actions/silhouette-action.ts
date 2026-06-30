"use server";

import { getSilhouetteProfile, saveSilhouetteProfile, clearSilhouetteProfile } from "@/lib/api/silhouette";
import { getTokenCookie } from "@/lib/cookies";

export const handleGetSilhouetteProfile = async () => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }
    return await getSilhouetteProfile(token);
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to retrieve silhouette profile",
      data: null,
    };
  }
};

export const handleSaveSilhouetteProfile = async (profileData: any) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }
    return await saveSilhouetteProfile(profileData, token);
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to save silhouette profile",
      data: null,
    };
  }
};

export const handleClearSilhouetteProfile = async () => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }
    return await clearSilhouetteProfile(token);
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to clear silhouette profile",
      data: null,
    };
  }
};
