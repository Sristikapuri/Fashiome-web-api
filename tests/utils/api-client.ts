import type { APIRequestContext } from "@playwright/test";
import { ADMIN_CREDENTIALS, buildRegisterPayload, type RegisterPayload } from "../test-data/users";

export const API_BASE_URL = process.env.E2E_API_BASE_URL || "http://localhost:8089";

type ApiEnvelope<T> = {
  statusCode: number;
  isSuccess: boolean;
  responseMessage: string;
  responseData: T;
};

async function post<T>(path: string, body: unknown): Promise<ApiEnvelope<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await response.json()) as ApiEnvelope<T>;
}


export async function registerUserViaApi(payload: RegisterPayload) {
  const { confirmPassword, ...rest } = payload;
  return post<{ _id: string; email: string }>("/api/v1/auth/register", {
    ...rest,
    age: Number(rest.age),
  });
}

export async function loginViaApi(email: string, password: string) {
  return post<{ token: string; user: Record<string, unknown> }>("/api/v1/auth/login", {
    email,
    password,
  });
}


export function authHeader(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}


export async function createAuthedMember(overrides: Partial<RegisterPayload> = {}) {
  const payload = buildRegisterPayload(overrides);
  const registerResult = await registerUserViaApi(payload);
  if (!registerResult.isSuccess) {
    throw new Error(`createAuthedMember: registration failed: ${registerResult.responseMessage}`);
  }

  const loginResult = await loginViaApi(payload.email, payload.password);
  if (!loginResult.isSuccess || !loginResult.responseData?.token) {
    throw new Error(`createAuthedMember: login failed: ${loginResult.responseMessage}`);
  }

  const user = loginResult.responseData.user as { _id: string };
  return { payload, token: loginResult.responseData.token, userId: user._id };
}


export async function getAdminToken(): Promise<string> {
  const loginResult = await loginViaApi(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
  if (!loginResult.isSuccess || !loginResult.responseData?.token) {
    throw new Error(`getAdminToken: admin login failed: ${loginResult.responseMessage}`);
  }
  return loginResult.responseData.token;
}


export async function getCatalogClotheId(request: APIRequestContext): Promise<string> {
  const response = await request.get(`${API_BASE_URL}/api/v1/home/clothes?limit=1`);
  const body = await response.json();
  const item = body.responseData?.data?.[0];
  if (!item?._id) {
    throw new Error("getCatalogClotheId: no active clothes item found in the public catalog");
  }
  return item._id as string;
}
