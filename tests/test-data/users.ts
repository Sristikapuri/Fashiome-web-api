import { uniqueEmail, uniqueUsername } from "../utils/random";

export const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || "admin@fashiome.com",
  password: process.env.ADMIN_PASSWORD || "admin123",
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender: "male" | "female" | "other";
  age: string;
  password: string;
  confirmPassword: string;
};

export function buildRegisterPayload(overrides: Partial<RegisterPayload> = {}): RegisterPayload {
  const password = overrides.password || "Passw0rd!";
  return {
    firstName: "Ava",
    lastName: "Stylist",
    username: uniqueUsername(),
    email: uniqueEmail(),
    gender: "female",
    age: "27",
    password,
    confirmPassword: overrides.confirmPassword ?? password,
    ...overrides,
  };
}

export type AdminUserPayload = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  gender: "male" | "female" | "other";
  age: string;
  role: "admin" | "user";
  status: "active" | "inactive";
};

export function buildAdminUserPayload(overrides: Partial<AdminUserPayload> = {}): AdminUserPayload {
  return {
    firstName: "Nina",
    lastName: "Wardrobe",
    username: uniqueUsername("e2eadmin"),
    email: uniqueEmail("admin-created"),
    password: "Passw0rd!",
    gender: "female",
    age: "30",
    role: "user",
    status: "active",
    ...overrides,
  };
}
