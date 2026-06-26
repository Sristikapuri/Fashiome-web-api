export const ROUTES = {
  welcome: "/",
  register: "/register",
  login: "/login",
  dashboard: "/dashboard",
  admin: "/dashboard/admin",
  profile: "/dashboard/profile",
  password: "/dashboard/profile/password",
  adminUsers: "/dashboard/admin/users",
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.welcome,
  ROUTES.login,
  ROUTES.register,
] as const;

export const PUBLIC_AUTH_ROUTES = [
  ROUTES.login,
  ROUTES.register,
] as const;

export const PROTECTED_ROUTES = [
  ROUTES.dashboard,
  ROUTES.admin,
] as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
