"use server";

import { register, login } from "@/lib/api/auth";
import { RegisterFormData, LoginFormData } from "@/app/(auth)/_components/schema";
import { setTokenCookie, storeUserData } from "@/lib/cookies";

export const handleRegisterUser = async (data: RegisterFormData) => {
  try {
    // ✅ Clean API payload and transform field names for backend
    const { confirmPassword, fullName, email, ...rest } = data;

    // Split fullName into firstName and lastName
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Generate unique username from email (before @ symbol)
    const username = email.split('@')[0].toLowerCase();

    const apiData = {
      firstName,
      lastName,
      username,
      email,
      ...rest,
      age: Number(rest.age), // 🔥 FIX: ensure number type
    };

    console.log("📦 FINAL REGISTER PAYLOAD:", apiData);

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
    console.log("❌ REGISTER ACTION ERROR:", error);

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
    console.log("❌ LOGIN ACTION ERROR:", error);

    return {
      success: false,
      message: error?.message || "Login failed",
    };
  }
};