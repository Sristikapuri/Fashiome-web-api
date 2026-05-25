export const ROUTES = {
  register: "/register",
  login: "/login",
  welcome: "/welcome",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
