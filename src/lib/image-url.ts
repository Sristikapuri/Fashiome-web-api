import { getApiBaseUrl } from "@/lib/api/base-url";


export function resolveApiImageUrl(value?: string | null): string | null {
  if (!value) return null;
  if (/^(https?:|blob:|data:)/i.test(value)) return value;

  const path = value.startsWith("/") ? value : `/${value}`;
  if (!path.startsWith("/uploads/")) return path;

  return `${getApiBaseUrl().replace(/\/$/, "")}${path}`;
}
