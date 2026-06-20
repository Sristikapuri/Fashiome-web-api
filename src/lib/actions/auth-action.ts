"use server";

import { register, login, updateProfile, whoami } from "@/lib/api/auth";
import { RegisterFormData, LoginFormData } from "@/app/(auth)/_components/schema";
import { clearAuthCookies, getTokenCookie, setTokenCookie, storeUserData } from "@/lib/cookies";

export const handleRegisterUser = async (data: RegisterFormData) => {
  try {
    const { confirmPassword, ...rest } = data;
    const apiData = {
      ...rest,
      age: Number(rest.age),
    };

    const result = await register(apiData);

    return result.success
      ? {
          success: true,
          message: result.message,
          data: result.data,
        }
      : {
          success: false,
          message: result.message || "Registration failed",
        };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.responseMessage || error?.message || "Registration failed",
    };
  }
};

export const handleLoginUser = async (data: LoginFormData) => {
  try {
    const result = await login(data);

    if (result.success) {
      if (result.data?.token) {
        await setTokenCookie(result.data.token);
      }

      if (result.data?.user) {
        await storeUserData(result.data.user);
      }

      return {
        success: true,
        message: result.message,
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Login failed",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Login failed",
    };
  }
};

export const handleLoadCurrentUser = async () => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }

    const result = await whoami(token);

    if (result.success && result.data) {
      await storeUserData(result.data);
    }

    return result;
  } catch (error: any) {
    await clearAuthCookies();
    return {
      success: false,
      message: error?.message || "Failed to load user",
      data: null,
    };
  }
};

export const handleUpdateProfile = async (data: FormData) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Please login first", data: null };
    }

    const result = await updateProfile(data, token);

    if (result.success && result.data) {
      await storeUserData(result.data);
    }

    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Profile update failed",
      data: null,
    };
  }
};

export const handleUpdatePassword = async (data: { password: string; confirmPassword: string }) => {
  try {
    if (data.password !== data.confirmPassword) {
      return { success: false, message: "Passwords do not match", data: null };
    }

    const formData = new FormData();
    formData.append("password", data.password);

    return await handleUpdateProfile(formData);
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Password update failed",
      data: null,
    };
  }
};
