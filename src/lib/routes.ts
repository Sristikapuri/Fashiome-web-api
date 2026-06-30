export const ROUTES = {
  welcome: "/",
  register: "/register",
  login: "/login",
  onboarding: "/onboarding",
  silhouette: "/silhouette",
  dashboard: "/dashboard",
  admin: "/dashboard/admin",
  profile: "/dashboard/profile",
  password: "/dashboard/profile/password",
  profileSecurity: "/dashboard/profile/security",
  profileSubscription: "/dashboard/profile/subscription",
  profileNotifications: "/dashboard/profile/notifications",
  adminUsers: "/dashboard/admin/users",
  adminClothes: "/dashboard/admin/clothes",
  adminOrders: "/dashboard/admin/orders",
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
  ROUTES.onboarding,
  ROUTES.silhouette,
] as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
