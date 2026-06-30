"use server";

import { getOnboardingStatus, completeOnboarding } from "@/lib/api/onboarding";
import { getTokenCookie } from "@/lib/cookies";

export const handleGetOnboardingStatus = async () => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }
    return await getOnboardingStatus(token);
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to retrieve onboarding status",
      data: null,
    };
  }
};

export const handleCompleteOnboarding = async (preferences: string[]) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }
    return await completeOnboarding(preferences, token);
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to complete onboarding",
      data: null,
    };
  }
};
