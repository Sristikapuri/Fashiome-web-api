import { calculatePriceBreakdown } from "./pricing";

export type LocalOrderItem = {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  discountedPrice?: number | null;
  imageUrl?: string;
  category?: string;
  color?: string;
  size?: string;
};

export type LocalOrder = {
  _id: string;
  createdAt: string;
  status: "pending" | "processing" | "completed";
  customerName: string;
  customerEmail: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  items: LocalOrderItem[];
  source: "local";
};

export type CreateLocalOrderInput = {
  customerName: string;
  customerEmail: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  items: LocalOrderItem[];
};

const ORDERS_STORAGE_KEY = "fashiome-local-orders";

const isBrowser = () => typeof window !== "undefined";

function readOrders(): LocalOrder[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((order): order is LocalOrder => typeof order === "object" && order !== null && "_id" in order);
  } catch {
    return [];
  }
}

function writeOrders(orders: LocalOrder[]) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // Ignore storage failures so checkout can still finish in the UI.
  }
}

export function listLocalOrders(): LocalOrder[] {
  return readOrders();
}

export function createLocalOrder(input: CreateLocalOrderInput): LocalOrder {
  const prices = input.items.map((item) =>
    calculatePriceBreakdown({
      price: Number(item.price),
      discountedPrice: item.discountedPrice ?? null,
      quantity: item.quantity,
      taxPercent: 5,
    })
  );

  const subtotal = prices.reduce((sum, line) => sum + line.subtotal, 0);
  const discount = prices.reduce((sum, line) => sum + line.discountAmount, 0);
  const tax = prices.reduce((sum, line) => sum + line.taxAmount, 0);
  const total = prices.reduce((sum, line) => sum + line.total, 0);

  const order: LocalOrder = {
    _id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: "processing",
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail.trim(),
    phone: input.phone?.trim() || undefined,
    address: input.address.trim(),
    city: input.city.trim(),
    postalCode: input.postalCode.trim(),
    subtotal,
    discount,
    tax,
    total,
    items: input.items.map((item) => ({ ...item })),
    source: "local",
  };

  const orders = [order, ...readOrders()];
  writeOrders(orders);

  return order;
}
