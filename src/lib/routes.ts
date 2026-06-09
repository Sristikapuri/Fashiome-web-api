export const ROUTES = {
  register: "/register",
  login: "/login",
  welcome: "/",
  dashboard: "/dashboard",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
