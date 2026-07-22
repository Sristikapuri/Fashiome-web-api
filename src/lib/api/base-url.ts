export function getApiBaseUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;

  if (!configuredUrl && process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL must be configured for a production website."
    );
  }

  return configuredUrl || "http://localhost:8089";
}
