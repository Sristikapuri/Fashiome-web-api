// centralized path definitions for API endpoints
export const API = {
  AUTH: {
    REGISTER: "/api/v1/auth/register",
    LOGIN: "/api/v1/auth/login",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    RESET_PASSWORD: "/api/v1/auth/reset-password",
    WHOAMI: "/api/v1/auth/whoami",
    UPDATE: "/api/v1/auth/update",
  },
  ADMIN: {
    USERS: "/api/v1/admin/users",
    USER_BY_ID: (id: string) => `/api/v1/admin/users/${id}`,
    CLOTHES: "/api/v1/admin/clothes",
    CLOTH_BY_ID: (id: string) => `/api/v1/admin/clothes/${id}`,
    LOW_STOCK: "/api/v1/admin/clothes/low-stock",
    ORDERS: "/api/v1/admin/orders",
    ORDER_BY_ID: (id: string) => `/api/v1/admin/orders/${id}`,
    ORDER_STATUS: (id: string) => `/api/v1/admin/orders/${id}/status`,
    ORDER_STATS: "/api/v1/admin/orders/stats",
  },
  HOME: {
    DASHBOARD: "/api/v1/home/dashboard",
    CLOTHES: "/api/v1/home/clothes",
    WARDROBE: "/api/v1/home/wardrobe",
    WARDROBE_ITEM: (id: string) => `/api/v1/home/wardrobe/${id}`,
    WARDROBE_SYNC: "/api/v1/home/wardrobe/sync",
    CHAT: "/api/v1/home/assistant-chat",
    RECOMMEND: "/api/v1/home/generate-outfit",
    TRENDS: "/api/v1/home/trends",
    SEARCH: "/api/v1/home/search",
    GENERATE_PROFILE: "/api/v1/home/generate-profile",
  },
  ONBOARDING: {
    STATUS: "/api/v1/onboarding/status",
    COMPLETE: "/api/v1/onboarding/complete",
  },
  SILHOUETTE: {
    PROFILE: "/api/v1/silhouette/profile",
  },
  ORDERS: {
    MINE: "/api/v1/orders/me",
    BY_ID: (id: string) => `/api/v1/orders/${id}`,
  },
};
