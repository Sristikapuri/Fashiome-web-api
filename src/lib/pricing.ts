export type PriceBreakdownInput = {
  price: number;
  quantity?: number;
  discountPercent?: number;
  taxPercent?: number;
  discountedPrice?: number | null;
};

export type PriceBreakdown = {
  unitPrice: number;
  quantity: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
};

const clampPercent = (value: number | undefined) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 100);
};

const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function calculatePriceBreakdown({
  price,
  quantity = 1,
  discountPercent = 0,
  taxPercent = 0,
  discountedPrice,
}: PriceBreakdownInput): PriceBreakdown {
  const unitPrice = Math.max(Number(price) || 0, 0);
  const safeQuantity = Math.max(Math.floor(Number(quantity) || 1), 1);
  const subtotal = roundMoney(unitPrice * safeQuantity);
  const saleUnitPrice = discountedPrice !== undefined && discountedPrice !== null ? Math.max(Number(discountedPrice) || 0, 0) : null;
  const safeDiscountPercent = clampPercent(discountPercent);
  const discountAmount = saleUnitPrice !== null
    ? roundMoney(Math.max(subtotal - roundMoney(saleUnitPrice * safeQuantity), 0))
    : roundMoney(subtotal * (safeDiscountPercent / 100));
  const taxableAmount = Math.max(subtotal - discountAmount, 0);
  const safeTaxPercent = clampPercent(taxPercent);
  const taxAmount = roundMoney(taxableAmount * (safeTaxPercent / 100));
  const total = roundMoney(taxableAmount + taxAmount);

  return {
    unitPrice: roundMoney(unitPrice),
    quantity: safeQuantity,
    subtotal,
    discountAmount,
    taxAmount,
    total,
  };
}

export function formatMoney(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number(value) || 0);
}
