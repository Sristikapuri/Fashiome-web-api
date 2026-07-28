import { randomUUID } from "node:crypto";


export function uniqueSuffix(): string {
  return randomUUID().replace(/-/g, "").slice(0, 10);
}

export function uniqueEmail(prefix = "e2e"): string {
  return `${prefix}.${uniqueSuffix()}@fashiome-e2e.test`;
}

export function uniqueUsername(prefix = "e2euser"): string {
  return `${prefix}${uniqueSuffix()}`;
}
