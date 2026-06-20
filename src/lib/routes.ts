export const ROUTES = {
  welcome: "/",
  register: "/register",
  login: "/login",
  dashboard: "/dashboard",
  profile: "/dashboard/profile",
  password: "/dashboard/profile/password",
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
] as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
