"use server";

import {
  addWardrobeItem,
  fetchDashboardData,
  generateOutfit,
  getWardrobe,
  sendAssistantChat,
  updateWardrobeItem,
} from "@/lib/api/home-api";
import { generateProfile, uploadPhoto } from "@/lib/api/dashboard";
import { getTokenCookie } from "@/lib/cookies";

export const handleGetDashboardData = async () => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }

    return await fetchDashboardData(token);
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to load dashboard",
      data: null,
    };
  }
};

export const handleGetWardrobe = async () => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }

    return await getWardrobe(token);
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to load wardrobe",
      data: null,
    };
  }
};

export const handleUploadWardrobePhoto = async (
  formData: FormData,
  category: string,
  title: string
) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }

    // Step 1: Upload the image file
    const uploadResult = await uploadPhoto(formData, token);
    if (!uploadResult.success || !uploadResult.data?.relativeFileUrl) {
      return {
        success: false,
        message: uploadResult.message || "Failed to upload photo",
        data: null,
      };
    }

    // Step 2: Add the uploaded photo as a wardrobe item (JSON body)
    const wardrobeItem = {
      title: title || 'My Item',
      category: category || 'Tops',
      tag: category || 'Tops',
      imageUrl: uploadResult.data.relativeFileUrl,
      entryType: 'upload',
    };

    const wardrobeResult = await addWardrobeItem(wardrobeItem, token);
    return {
      success: wardrobeResult.success,
      message: wardrobeResult.success
        ? "Item added to your wardrobe!"
        : wardrobeResult.message || "Photo uploaded but failed to add to wardrobe",
      data: wardrobeResult.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to upload photo",
      data: null,
    };
  }
};

export const handleGenerateProfileFromImage = async ({
  imageFormData,
  profileData,
  occasion,
  preferenceScores,
  source,
}: {
  imageFormData: FormData;
  profileData?: any;
  occasion?: string;
  preferenceScores?: Record<string, number>;
  source?: string;
}) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }

    const uploadResult = await uploadPhoto(imageFormData, token);
    if (!uploadResult.success || !uploadResult.data?.relativeFileUrl) {
      return {
        success: false,
        message: uploadResult.message || "Failed to upload photo",
        data: null,
      };
    }

    return await generateProfile(
      {
        profileData,
        imageReference: uploadResult.data.relativeFileUrl,
        occasion,
        preferenceScores,
        source,
      },
      token
    );
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to generate profile from image",
      data: null,
    };
  }
};

export const handleUpdateWardrobeItem = async (itemId: string, payload: any) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }

    return await updateWardrobeItem(itemId, payload, token);
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update item",
      data: null,
    };
  }
};

export const handleSendAssistantChat = async (payload: any) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }

    return await sendAssistantChat(payload, token);
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to send chat",
      data: null,
    };
  }
};

export const handleGenerateOutfit = async (payload: any) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }

    return await generateOutfit(payload, token);
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to generate outfit",
      data: null,
    };
  }
};
