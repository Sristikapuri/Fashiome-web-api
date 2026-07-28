// Mirrors src/lib/routes.ts. Kept as a small independent copy so the E2E
// suite doesn't reach into app internals and stays stable across refactors.
export const ROUTES = {
  welcome: "/",
  register: "/register",
  login: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  onboarding: "/onboarding",
  silhouette: "/silhouette",
  dashboard: "/dashboard",
  admin: "/dashboard/admin",
  profile: "/dashboard/profile",
  adminUsers: "/dashboard/admin/users",
  adminClothes: "/dashboard/admin/clothes",
  adminOrders: "/dashboard/admin/orders",
} as const;
