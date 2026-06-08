"use server";

import { register, login } from "@/lib/api/auth";
import { RegisterFormData, LoginFormData } from "@/components/auth.schema";
import { setTokenCookie, storeUserData } from "@/lib/cookies";

export const handleRegisterUser = async (data: RegisterFormData) => {
  try {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...apiData } = data;
    
    const result = await register(apiData);
    if (result.success) {
      return { success: true, message: result.message, data: result.data };
    } else {
      return { success: false, message: result.message || "Registration failed" };
    }
  } catch (error: Error | any) {
    return { success: false, message: error?.message || "Registration failed" };
  }
};

export const handleLoginUser = async (data: LoginFormData) => {
  try {
    const result = await login(data);

    if (result.success) {
      // Set cookies for authentication
      if (result.data?.token) {
        await setTokenCookie(result.data.token);
      }
      if (result.data?.user) {
        await storeUserData(result.data.user);
      }
      return { success: true, message: result.message, data: result.data };
    } else {
      return { success: false, message: result.message || "Login failed" };
    }
  } catch (error: Error | any) {
    return { success: false, message: error?.message || "Login failed" };
  }
};
