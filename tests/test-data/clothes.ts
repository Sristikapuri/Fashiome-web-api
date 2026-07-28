import { uniqueSuffix } from "../utils/random";

export type ClothePayload = {
  name: string;
  category: string;
  size: string;
  color: string;
  price: string;
  discountedPrice?: string;
  stock: string;
  description: string;
  status: "active" | "inactive";
};

export function buildClothePayload(overrides: Partial<ClothePayload> = {}): ClothePayload {
  return {
    name: `E2E Silk Blazer ${uniqueSuffix()}`,
    category: "outerwear",
    size: "M",
    color: "Beige",
    price: "89.99",
    stock: "12",
    description: "Created by the Playwright E2E suite.",
    status: "active",
    ...overrides,
  };
}

export type ClotheApiPayload = {
  name: string;
  category: string;
  gender?: "male" | "female" | "unisex";
  size: string;
  color: string;
  price: number;
  discountedPrice?: number | null;
  stock: number;
  description: string;
  status: "active" | "inactive";
};

/**
 * Numeric-typed counterpart of {@link buildClothePayload} for specs that hit
 * the admin clothes API directly (JSON body) instead of driving the create
 * form, which submits price/stock as strings.
 */
export function buildClotheApiPayload(overrides: Partial<ClotheApiPayload> = {}): ClotheApiPayload {
  return {
    name: `E2E API Clothe ${uniqueSuffix()}`,
    category: "outerwear",
    gender: "unisex",
    size: "M",
    color: "Beige",
    price: 89.99,
    stock: 12,
    description: "Created by the Playwright API suite.",
    status: "active",
    ...overrides,
  };
}
