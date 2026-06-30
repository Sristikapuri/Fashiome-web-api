import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const getOnboardingStatus = async (token: string) => {
  try {
    const response = await axiosInstance.get(API.ONBOARDING.STATUS, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const apiResponse = response.data;
    return {
      success: apiResponse.isSuccess,
      message: apiResponse.responseMessage,
      data: apiResponse.responseData,
    };
  } catch (error: any) {
    throw new Error(error?.response?.data?.responseMessage || "Failed to fetch onboarding status");
  }
};

export const completeOnboarding = async (preferences: string[], token: string) => {
  try {
    const response = await axiosInstance.post(
      API.ONBOARDING.COMPLETE,
      { preferences },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const apiResponse = response.data;
    return {
      success: apiResponse.isSuccess,
      message: apiResponse.responseMessage,
      data: apiResponse.responseData,
    };
  } catch (error: any) {
    throw new Error(error?.response?.data?.responseMessage || "Failed to complete onboarding");
  }
};
