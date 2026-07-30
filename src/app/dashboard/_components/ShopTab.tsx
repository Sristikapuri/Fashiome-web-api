"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  Sparkles,
  BadgeCheck,
  X,
  MapPin,
  Phone,
  Mail,
  User,
  Building2,
  Hash,
  CreditCard,
  Truck,
  CheckCircle2,
  Star,
  Venus,
  Mars,
  CircleDot,
} from "lucide-react";
import { handleGetHomeClothes } from "@/lib/actions/home-clothes-action";
import { handleGetCart, handleSetCart } from "@/lib/actions/cart-action";
import { handleCreateOrder } from "@/lib/actions/order-action";
import { handleGetEsewaPaymentUrl } from "@/lib/actions/esewa-action";
import { handleGetReviewsByClothe } from "@/lib/actions/review-action";
import { calculatePriceBreakdown, formatMoney } from "@/lib/pricing";
import { StarRating } from "@/components/StarRating";
import { ReviewModal } from "@/components/ReviewModal";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getApiBaseUrl } from "@/lib/api/base-url";

type ClothingGender = "male" | "female" | "unisex";

type ShopClothe = {
  _id: string;
  name: string;
  category: string;
  gender?: ClothingGender;
  size: string;
  color: string;
  price: number;
  discountedPrice?: number | null;
  stock: number;
  imageUrl?: string;
  description?: string;
  status?: "active" | "inactive";
};

type BagItem = ShopClothe & { quantity: number };
type BackendCartItem = {
  clotheId?: string;
  clothe?: ShopClothe;
  quantity: number;
};

const categories = [
  "All",
  "tops",
  "bottoms",
  "dresses",
  "party-wear",
  "gown",
  "formal-wear",
  "streetwear",
  "traditional",
  "outerwear",
  "activewear",
  "shirts",
  "pants",
  "skirts",
  "sweaters",
  "shoes",
  "accessories",
];

const GENDER_FILTERS = [
  { label: "All", value: "all", emoji: "✦" },
  { label: "Female", value: "female", emoji: "♀" },
  { label: "Male", value: "male", emoji: "♂" },
] as const;

type GenderFilter = "all" | "female" | "male";

function resolveImage(value?: string) {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  const base = getApiBaseUrl();
  return `${base}${value}`;
}

// ─── Checkout Modal ──────────────────────────────────────────────────────────
function CheckoutModal({
  open,
  onClose,
  bagSummary,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  bagSummary: { subtotal: number; discount: number; tax: number; total: number; count: number };
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod" as "cod" | "esewa",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.customerName.trim() || !form.customerEmail.trim() || !form.phone.trim() ||
        !form.address.trim() || !form.city.trim() || !form.postalCode.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setStep("processing");

    try {
      const shippingAddress = `${form.address}, ${form.city}, ${form.postalCode}`;
      
      // For eSewa, first create order then redirect to payment
      if (form.paymentMethod === "esewa") {
        const orderResult = await handleCreateOrder({
          shippingAddress,
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          phone: form.phone,
          city: form.city,
          postalCode: form.postalCode,
          paymentMethod: "esewa",
        });

        if (!orderResult.success) {
          setError(orderResult.message || "Failed to place order.");
          setStep("form");
          return;
        }

        const orderPayload = orderResult.data as any;
        const orderId =
          orderPayload?.order?._id ||
          orderPayload?._id ||
          orderPayload?.orderId;
        if (!orderId) {
          setError("Failed to get order ID.");
          setStep("form");
          return;
        }

        // Generate eSewa payment URL
        const paymentResult = await handleGetEsewaPaymentUrl({
          amount: bagSummary.total,
          orderId,
          productCode: "FASHIOME_ORDER",
        });

        if (!paymentResult.success || !paymentResult.data?.paymentUrl) {
          setError(paymentResult.message || "Failed to generate payment URL.");
          setStep("form");
          return;
        }

        // Redirect to eSewa
        window.location.href = paymentResult.data.paymentUrl;
        return;
      }

      // For COD, place order directly
      const result = await handleCreateOrder({
        shippingAddress,
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        phone: form.phone,
        city: form.city,
        postalCode: form.postalCode,
        paymentMethod: "cod",
      });

      if (!result.success) {
        setError(result.message || "Failed to place order.");
        setStep("form");
        return;
      }

      setStep("success");
      onSuccess();
    } catch (err: any) {
      setError(err?.message || "Failed to place order.");
      setStep("form");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-[#260909] px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E7B8B8]">
              Secure Checkout
            </p>
            <h2 className="mt-0.5 text-xl font-black text-white">Complete Your Order</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === "success" ? (
          <div className="flex flex-col items-center justify-center gap-4 px-8 py-16 text-center">
            <div className="rounded-full bg-[#FFECEC] p-6">
              <CheckCircle2 className="h-12 w-12 text-[#820000]" />
            </div>
            <h3 className="text-2xl font-black text-[#260909]">Order Placed! 🎉</h3>
            <p className="text-[#735656]">
              Your order has been received. Check <strong>My Orders</strong> in your profile to track it.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 rounded-2xl bg-[#820000] px-8 py-3 font-bold text-white hover:bg-[#A41515] transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Order summary strip */}
            <div className="rounded-2xl bg-[#FFF7F7] border border-[#E7B8B8] px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A7E74] mb-2">
                Order Summary
              </p>
              <div className="flex items-center justify-between text-sm text-[#735656]">
                <span>{bagSummary.count} item{bagSummary.count !== 1 ? "s" : ""}</span>
                <span>Subtotal {formatMoney(bagSummary.subtotal)}</span>
              </div>
              {bagSummary.discount > 0 && (
                <div className="flex items-center justify-between text-sm text-emerald-600">
                  <span>Savings</span>
                  <span>-{formatMoney(bagSummary.discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm text-[#735656]">
                <span>Tax (5%)</span>
                <span>{formatMoney(bagSummary.tax)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-[#E7B8B8] pt-2 text-base font-black text-[#260909]">
                <span>Total</span>
                <span>{formatMoney(bagSummary.total)}</span>
              </div>
            </div>

            {/* Personal Details */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-[#820000]" />
                <h3 className="font-bold text-[#260909]">Personal Details</h3>
              </div>
              <div className="grid gap-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A7E74]" />
                  <input
                    required
                    type="text"
                    placeholder="Full Name *"
                    value={form.customerName}
                    onChange={set("customerName")}
                    className="w-full rounded-xl border border-[#E7B8B8] bg-[#FFF7F7] py-3 pl-10 pr-4 text-sm text-[#260909] outline-none focus:ring-2 focus:ring-[#820000]/20 placeholder:text-[#B8A0A0]"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A7E74]" />
                  <input
                    required
                    type="email"
                    placeholder="Email Address *"
                    value={form.customerEmail}
                    onChange={set("customerEmail")}
                    className="w-full rounded-xl border border-[#E7B8B8] bg-[#FFF7F7] py-3 pl-10 pr-4 text-sm text-[#260909] outline-none focus:ring-2 focus:ring-[#820000]/20 placeholder:text-[#B8A0A0]"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A7E74]" />
                  <input
                    required
                    type="tel"
                    placeholder="Phone Number *"
                    value={form.phone}
                    onChange={set("phone")}
                    className="w-full rounded-xl border border-[#E7B8B8] bg-[#FFF7F7] py-3 pl-10 pr-4 text-sm text-[#260909] outline-none focus:ring-2 focus:ring-[#820000]/20 placeholder:text-[#B8A0A0]"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#820000]" />
                <h3 className="font-bold text-[#260909]">Delivery Address</h3>
              </div>
              <div className="grid gap-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-[#9A7E74]" />
                  <textarea
                    required
                    placeholder="Street Address *"
                    value={form.address}
                    onChange={set("address")}
                    rows={2}
                    className="w-full rounded-xl border border-[#E7B8B8] bg-[#FFF7F7] py-3 pl-10 pr-4 text-sm text-[#260909] outline-none focus:ring-2 focus:ring-[#820000]/20 placeholder:text-[#B8A0A0] resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A7E74]" />
                    <input
                      required
                      type="text"
                      placeholder="City *"
                      value={form.city}
                      onChange={set("city")}
                      className="w-full rounded-xl border border-[#E7B8B8] bg-[#FFF7F7] py-3 pl-10 pr-4 text-sm text-[#260909] outline-none focus:ring-2 focus:ring-[#820000]/20 placeholder:text-[#B8A0A0]"
                    />
                  </div>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A7E74]" />
                    <input
                      required
                      type="text"
                      placeholder="Postal Code *"
                      value={form.postalCode}
                      onChange={set("postalCode")}
                      className="w-full rounded-xl border border-[#E7B8B8] bg-[#FFF7F7] py-3 pl-10 pr-4 text-sm text-[#260909] outline-none focus:ring-2 focus:ring-[#820000]/20 placeholder:text-[#B8A0A0]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#820000]" />
                <h3 className="font-bold text-[#260909]">Payment Method</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* COD */}
                <label
                  className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 p-4 transition ${
                    form.paymentMethod === "cod"
                      ? "border-[#820000] bg-[#FFF7F7]"
                      : "border-[#E7B8B8] bg-white hover:border-[#c59090]"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={form.paymentMethod === "cod"}
                    onChange={() => setForm((prev) => ({ ...prev, paymentMethod: "cod" }))}
                    className="sr-only"
                  />
                  <Truck className="h-7 w-7 text-[#820000]" />
                  <div className="text-center">
                    <p className="text-sm font-bold text-[#260909]">Cash on Delivery</p>
                    <p className="text-xs text-[#9A7E74]">Pay when delivered</p>
                  </div>
                  {form.paymentMethod === "cod" && (
                    <BadgeCheck className="h-4 w-4 text-[#820000]" />
                  )}
                </label>

                {/* eSewa */}
                <label
                  className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 p-4 transition ${
                    form.paymentMethod === "esewa"
                      ? "border-[#60bb46] bg-[#f0fbee]"
                      : "border-[#E7B8B8] bg-white hover:border-[#60bb46]/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="esewa"
                    checked={form.paymentMethod === "esewa"}
                    onChange={() => setForm((prev) => ({ ...prev, paymentMethod: "esewa" }))}
                    className="sr-only"
                  />
                  {/* eSewa logo placeholder */}
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#60bb46] text-white font-black text-xs">
                    e
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-[#260909]">eSewa</p>
                    <p className="text-xs text-[#9A7E74]">Digital wallet</p>
                  </div>
                  {form.paymentMethod === "esewa" && (
                    <BadgeCheck className="h-4 w-4 text-[#60bb46]" />
                  )}
                </label>
              </div>

              {form.paymentMethod === "esewa" && (
                <div className="mt-3 rounded-xl border border-[#60bb46]/30 bg-[#f0fbee] px-4 py-3 text-xs text-[#3d7a2b]">
                  You&apos;ll be redirected to eSewa. Your order will be marked as <strong>Paid</strong> after payment verification.
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={step === "processing"}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#820000] px-6 py-4 text-base font-black text-white transition hover:bg-[#A41515] disabled:cursor-not-allowed disabled:bg-[#C9B0B0] shadow-lg shadow-[#820000]/20"
            >
              {step === "processing" ? (
                <>
                  <span className="animate-spin">⏳</span> Processing...
                </>
              ) : form.paymentMethod === "esewa" ? (
                <>Confirm eSewa Payment — {formatMoney(bagSummary.total)}</>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Place Order — {formatMoney(bagSummary.total)}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Main ShopTab ─────────────────────────────────────────────────────────────
export function ShopTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [items, setItems] = useState<ShopClothe[]>([]);
  const [bagItems, setBagItems] = useState<BagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>(() => {
    // Auto-set gender filter to user's gender on first load
    const g = (user as any)?.gender;
    if (g === "female" || g === "male") return g;
    return "all";
  });
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [showMatchedOnly, setShowMatchedOnly] = useState(false);
  const [productRatings, setProductRatings] = useState<Record<string, { averageRating: number; totalReviews: number }>>({});
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState<ShopClothe | null>(null);

  const matchedProductIds = useMemo(() => {
    const raw = searchParams.get("shopItems") || "";
    return raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [searchParams]);

  const focusProductId = searchParams.get("shopFocus") || "";
  const matchedIdSet = useMemo(() => new Set(matchedProductIds), [matchedProductIds]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const result = await handleGetHomeClothes({ limit: 24 });
        if (!cancelled && result.success && result.data) {
          setItems(result.data);
          
          // Load reviews for all products
          const ratingsPromises = result.data.map(async (item: ShopClothe) => {
            const reviewResult = await handleGetReviewsByClothe(item._id);
            if (reviewResult.success && reviewResult.data) {
              return {
                [item._id]: {
                  averageRating: reviewResult.data.stats?.averageRating || 0,
                  totalReviews: reviewResult.data.stats?.totalReviews || 0,
                },
              };
            }
            return null;
          });
          
          const ratingsResults = await Promise.all(ratingsPromises);
          const ratingsMap = ratingsResults.reduce<
            Record<string, { averageRating: number; totalReviews: number }>
          >((acc, result) => {
            if (result) {
              return { ...acc, ...result };
            }
            return acc;
          }, {});
          
          if (!cancelled) {
            setProductRatings(ratingsMap);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const queryCategory = searchParams.get("shopCategory");
    const querySearch = searchParams.get("shopSearch");

    if (queryCategory && categories.includes(queryCategory)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveCategory(queryCategory);
    } else {
      setActiveCategory("All");
    }

    setSearch(querySearch || "");
    setShowMatchedOnly(matchedProductIds.length > 0);
  }, [matchedProductIds.length, searchParams]);

  useEffect(() => {
    let cancelled = false;
    const loadCart = async () => {
      try {
        const result = await handleGetCart();
        if (!cancelled && result.success && result.data) {
          const cartItemsList = (result.data.items || []) as BackendCartItem[];
          const bagItemsList = cartItemsList
            .map((cartItem) => {
              const backendProduct = cartItem.clothe;
              const productId = backendProduct?._id || cartItem.clotheId;
              if (!productId) return null;
              const product =
                items.find((item) => item._id === productId) || backendProduct;
              if (product) return { ...product, quantity: cartItem.quantity };
              return null;
            })
            .filter((item): item is BagItem => item !== null);
          setBagItems(bagItemsList);
        }
      } catch {
        // ignore cart load errors silently
      }
    };
    void loadCart();
    return () => { cancelled = true; };
  }, [items]);

  const filteredItems = useMemo(() => {
    const filtered = items.filter((item) => {
      if (activeCategory !== "All" && item.category !== activeCategory) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
      // Gender filtering: unisex items always show, gender-specific items filtered by selection
      if (genderFilter !== "all") {
        const itemGender = item.gender || "unisex";
        if (itemGender !== "unisex" && itemGender !== genderFilter) return false;
      }
      return true;
    });

    const matchedFiltered = showMatchedOnly && matchedIdSet.size > 0
      ? filtered.filter((item) => matchedIdSet.has(item._id))
      : filtered;

    return [...matchedFiltered].sort((left, right) => {
      const leftScore =
        (matchedIdSet.has(left._id) ? 2 : 0) +
        (left._id === focusProductId ? 3 : 0);
      const rightScore =
        (matchedIdSet.has(right._id) ? 2 : 0) +
        (right._id === focusProductId ? 3 : 0);

      return rightScore - leftScore;
    });
  }, [items, activeCategory, search, genderFilter, showMatchedOnly, matchedIdSet, focusProductId]);

  const featuredDeals = useMemo(() => {
    return items
      .filter((item) => item.discountedPrice !== null && item.discountedPrice !== undefined)
      .slice(0, 3);
  }, [items]);

  const bagSummary = useMemo(() => {
    return bagItems.reduce(
      (summary, item) => {
        const line = calculatePriceBreakdown({
          price: Number(item.price),
          discountedPrice: item.discountedPrice ?? null,
          quantity: item.quantity,
          taxPercent: 5,
        });
        summary.subtotal += line.subtotal;
        summary.discount += line.discountAmount;
        summary.tax += line.taxAmount;
        summary.total += line.total;
        summary.count += item.quantity;
        return summary;
      },
      { subtotal: 0, discount: 0, tax: 0, total: 0, count: 0 }
    );
  }, [bagItems]);

  const syncCart = useCallback(async (newBagItems: BagItem[]) => {
    const cartItems = newBagItems.map((bagItem) => ({
      clotheId: bagItem._id,
      quantity: bagItem.quantity,
    }));
    await handleSetCart(cartItems);
  }, []);

  const addToBag = async (item: ShopClothe) => {
    const existing = bagItems.find((entry) => entry._id === item._id);
    let newBagItems: BagItem[];
    if (existing) {
      newBagItems = bagItems.map((entry) =>
        entry._id === item._id ? { ...entry, quantity: entry.quantity + 1 } : entry
      );
    } else {
      newBagItems = [...bagItems, { ...item, quantity: 1 }];
    }
    setBagItems(newBagItems);
    await syncCart(newBagItems);
  };

  const updateBagQuantity = async (id: string, quantity: number) => {
    let newBagItems: BagItem[];
    if (quantity <= 0) {
      newBagItems = bagItems.filter((item) => item._id !== id);
    } else {
      newBagItems = bagItems.map((item) => (item._id === id ? { ...item, quantity } : item));
    }
    setBagItems(newBagItems);
    await syncCart(newBagItems);
  };

  const removeFromBag = async (id: string) => {
    const newBagItems = bagItems.filter((item) => item._id !== id);
    setBagItems(newBagItems);
    await syncCart(newBagItems);
  };

  const handleOrderSuccess = async () => {
    setBagItems([]);
    await handleSetCart([]);
  };

  const clearMatchedView = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "shop");
    params.delete("shopItems");
    params.delete("shopFocus");
    params.delete("shopCategory");
    params.delete("shopSearch");
    router.replace(`/dashboard?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        bagSummary={bagSummary}
        onSuccess={handleOrderSuccess}
      />

      {selectedProductForReview && (
        <ReviewModal
          open={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedProductForReview(null);
          }}
          clotheId={selectedProductForReview._id}
          clotheName={selectedProductForReview.name}
          onSuccess={() => {
            // Reload ratings for this product
            handleGetReviewsByClothe(selectedProductForReview._id).then((result) => {
              if (result.success && result.data) {
                setProductRatings((prev) => ({
                  ...prev,
                  [selectedProductForReview._id]: {
                    averageRating: result.data.stats?.averageRating || 0,
                    totalReviews: result.data.stats?.totalReviews || 0,
                  },
                }));
              }
            });
          }}
        />
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px] animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Left: Products */}
        <div className="space-y-6">
          {featuredDeals.length > 0 && (
            <section className="rounded-[1.75rem] border border-[#E7B8B8] bg-gradient-to-r from-[#fff8f5] to-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9A7E74]">Special picks</p>
                  <h2 className="mt-1 text-2xl font-black text-[#260909]">Featured Deals</h2>
                </div>
                <span className="rounded-full bg-[#820000] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
                  Limited offer
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                {featuredDeals.map((item) => {
                  const image = resolveImage(item.imageUrl);
                  const original = calculatePriceBreakdown({
                    price: Number(item.price),
                    discountedPrice: item.discountedPrice ?? null,
                  });
                  return (
                    <div key={item._id} className="overflow-hidden rounded-2xl border border-[#f0d8d0] bg-white p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#FFF7F7]">
                          {image ? <Image src={image} alt={item.name} fill unoptimized className="object-cover" /> : null}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[#260909]">{item.name}</p>
                          <p className="text-xs text-[#735656]">{item.category}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-end justify-between gap-x-2 gap-y-1">
                        <div>
                          <p className="text-xs text-[#9A7E74] line-through">{formatMoney(original.unitPrice)}</p>
                          <p className="text-lg font-black text-[#820000]">{formatMoney(item.discountedPrice ?? 0)}</p>
                        </div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A7E74]">
                          Save {formatMoney(original.discountAmount)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Search & Filter */}
          <div className="rounded-2xl border border-[#E7B8B8] bg-white p-4 shadow-sm">
            {matchedProductIds.length > 0 && (
              <div className="mb-4 rounded-2xl border border-[#E7B8B8] bg-[#FFF7F7] px-4 py-3">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#820000]">
                      AI matched products
                    </p>
                    <p className="mt-1 text-sm text-[#735656]">
                      {showMatchedOnly
                        ? "Showing the products matched to your latest outfit recommendation."
                        : "Matched products are highlighted below."}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowMatchedOnly((current) => !current)}
                      className="rounded-full border border-[#E7B8B8] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#820000]"
                    >
                      {showMatchedOnly ? "Show all products" : "Show matched only"}
                    </button>
                    <button
                      type="button"
                      onClick={clearMatchedView}
                      className="rounded-full border border-[#E7B8B8] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#6F574F]"
                    >
                      Clear match view
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#735656]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-[#E7B8B8] bg-[#FFF7F7] py-2.5 pl-10 pr-4 text-[#260909] outline-none focus:ring-2 focus:ring-[#820000]/20"
                />
              </div>
            </div>

            {/* Gender Filter */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="shrink-0 text-xs font-bold uppercase tracking-[0.14em] text-[#9A7E74]">For:</span>
              <div className="flex gap-2">
                {GENDER_FILTERS.map((gf) => (
                  <button
                    key={gf.value}
                    type="button"
                    onClick={() => setGenderFilter(gf.value)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                      genderFilter === gf.value
                        ? gf.value === "female"
                          ? "bg-pink-500 text-white shadow-sm"
                          : gf.value === "male"
                          ? "bg-sky-600 text-white shadow-sm"
                          : "bg-[#820000] text-white"
                        : "bg-[#FFF7F7] text-[#735656] border border-[#E7B8B8] hover:text-[#820000]"
                    }`}
                  >
                    <span>{gf.emoji}</span>
                    {gf.label}
                  </button>
                ))}
              </div>
              <span className="ml-auto text-xs text-[#9A7E74]">{filteredItems.length} items</span>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                    activeCategory === category
                      ? "bg-[#820000] text-white"
                      : "bg-[#FFF7F7] text-[#735656] hover:text-[#820000]"
                  }`}
                >
                  {category === "All" ? "All" : category.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="rounded-2xl border border-dashed border-[#E7B8B8] bg-white py-16 text-center text-[#735656]">
              Loading storefront...
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => {
                const priceSummary = calculatePriceBreakdown({
                  price: Number(item.price),
                  taxPercent: 5,
                  discountedPrice: item.discountedPrice ?? null,
                });
                const image = resolveImage(item.imageUrl);
                const inBag = bagItems.find((b) => b._id === item._id);

                return (
                  <article
                    key={item._id}
                    className={`overflow-hidden rounded-[1.75rem] border bg-white shadow-sm transition-shadow ${
                      item._id === focusProductId
                        ? "border-[#820000] ring-2 ring-[#820000]/20 shadow-md"
                        : matchedIdSet.has(item._id)
                          ? "border-[#D8A0A0] ring-1 ring-[#D8A0A0]/40 hover:shadow-md"
                          : "border-[#E7B8B8] hover:shadow-md"
                    }`}
                  >
                    <div className="relative h-64 bg-[#FFF7F7]">
                      {image ? (
                        <Image src={image} alt={item.name} fill unoptimized className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm font-semibold text-[#735656]">
                          No image
                        </div>
                      )}
                      {item.discountedPrice !== null && item.discountedPrice !== undefined && (
                        <span className="absolute left-3 top-3 rounded-full bg-[#820000] px-3 py-1 text-xs font-bold text-white shadow">
                          SALE
                        </span>
                      )}
                      {matchedIdSet.has(item._id) && (
                        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#820000] shadow">
                          AI match
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 p-5">
                      <div className="flex justify-end">
                        <span className="shrink-0 rounded-full bg-[#FFF7F7] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#820000] whitespace-nowrap">
                          {item.stock} in stock
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold leading-snug text-[#260909]">{item.name}</h3>
                        <p className="text-sm text-[#735656]">
                          {item.category} • {item.color} • {item.size}
                        </p>
                        {productRatings[item._id] && productRatings[item._id].totalReviews > 0 && (
                          <div className="mt-2">
                            <StarRating
                              rating={productRatings[item._id].averageRating}
                              size={14}
                              showCount={true}
                              reviewCount={productRatings[item._id].totalReviews}
                            />
                          </div>
                        )}
                      </div>

                      <p className="line-clamp-2 text-sm text-[#735656]">
                        {item.description || "Styled for the catalog and ready to shop."}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#FFF7F7] p-4">
                        <div>
                          {item.discountedPrice !== null && item.discountedPrice !== undefined ? (
                            <div className="flex flex-wrap items-baseline gap-2">
                              <p className="text-base font-bold text-[#9A7E74] line-through">
                                {formatMoney(priceSummary.unitPrice)}
                              </p>
                              <p className="text-xl font-black text-[#820000]">
                                {formatMoney(item.discountedPrice)}
                              </p>
                            </div>
                          ) : (
                            <p className="text-xl font-black text-[#260909]">
                              {formatMoney(priceSummary.unitPrice)}
                            </p>
                          )}
                        </div>
                        {item.discountedPrice !== null && item.discountedPrice !== undefined && (
                          <span className="shrink-0 rounded-full bg-[#820000] px-3 py-1 text-xs font-bold uppercase text-white">
                            Save {formatMoney(priceSummary.discountAmount)}
                          </span>
                        )}
                      </div>

                      {inBag ? (
                        <div className="flex items-center justify-between rounded-2xl border border-[#E7B8B8] bg-[#FFF7F7] px-4 py-2">
                          <span className="text-sm font-semibold text-[#820000]">In bag</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateBagQuantity(item._id, inBag.quantity - 1)}
                              className="rounded-full border border-[#E7B8B8] bg-white p-1.5 text-[#820000]"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-bold text-[#260909]">
                              {inBag.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateBagQuantity(item._id, inBag.quantity + 1)}
                              className="rounded-full border border-[#E7B8B8] bg-white p-1.5 text-[#820000]"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => addToBag(item)}
                            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#820000] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#A41515]"
                          >
                            <ShoppingBag className="h-4 w-4" />
                            Add to bag
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProductForReview(item);
                              setReviewModalOpen(true);
                            }}
                            className="flex items-center justify-center rounded-2xl border border-[#E7B8B8] bg-[#FFF7F7] px-3 py-3 text-[#820000] hover:bg-[#FFECEC] transition"
                            title="Write a review"
                          >
                            <Star className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#E7B8B8] bg-white py-16 text-center text-[#735656]">
              {matchedProductIds.length > 0 && showMatchedOnly
                ? "No matched products were found for the current filter."
                : "No products found."}
            </div>
          )}
        </div>

        {/* Right: Bag Sidebar */}
        <aside className="h-fit rounded-[1.75rem] border border-[#E7B8B8] bg-white p-5 shadow-sm xl:sticky xl:top-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9A7E74]">Shopping bag</p>
              <h3 className="mt-1 text-2xl font-black text-[#260909]">{bagSummary.count} items</h3>
            </div>
            <div className="rounded-2xl bg-[#FFF7F7] p-3 text-[#820000]">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {bagItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#E7B8B8] bg-[#FFF7F7] p-5 text-sm text-[#735656]">
                Your bag is empty. Add a few pieces to see the totals here.
              </div>
            ) : (
              bagItems.map((item) => {
                const image = resolveImage(item.imageUrl);
                const line = calculatePriceBreakdown({
                  price: Number(item.price),
                  discountedPrice: item.discountedPrice ?? null,
                  quantity: item.quantity,
                  taxPercent: 5,
                });
                return (
                  <div key={item._id} className="rounded-2xl border border-[#f0d8d0] bg-[#fff8f5] p-3">
                    <div className="flex gap-3">
                      <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-white shrink-0">
                        {image ? <Image src={image} alt={item.name} fill unoptimized className="object-cover" /> : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#260909]">{item.name}</p>
                        <p className="text-xs text-[#735656]">{formatMoney(line.total)} total</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateBagQuantity(item._id, item.quantity - 1)}
                            className="rounded-full border border-[#E7B8B8] bg-white p-1.5 text-[#820000]"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-[#260909]">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateBagQuantity(item._id, item.quantity + 1)}
                            className="rounded-full border border-[#E7B8B8] bg-white p-1.5 text-[#820000]"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromBag(item._id)}
                            className="ml-auto rounded-full border border-[#E7B8B8] bg-white p-1.5 text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Summary */}
          <div className="mt-5 space-y-2 rounded-2xl bg-[#FFF7F7] p-4 text-sm">
            <div className="flex items-center justify-between text-[#735656]">
              <span>Subtotal</span>
              <span>{formatMoney(bagSummary.subtotal)}</span>
            </div>
            {bagSummary.discount > 0 && (
              <div className="flex items-center justify-between text-emerald-600">
                <span>Savings</span>
                <span>-{formatMoney(bagSummary.discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-[#735656]">
              <span>Tax (5%)</span>
              <span>{formatMoney(bagSummary.tax)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-[#E7B8B8] pt-2 text-base font-black text-[#260909]">
              <span>Total</span>
              <span>{formatMoney(bagSummary.total)}</span>
            </div>
          </div>

          <button
            type="button"
            id="checkout-btn"
            onClick={() => setCheckoutOpen(true)}
            disabled={bagItems.length === 0}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#820000] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#A41515] disabled:cursor-not-allowed disabled:bg-[#C9B0B0] shadow-lg shadow-[#820000]/20"
          >
            <Sparkles className="h-4 w-4" />
            Checkout — {formatMoney(bagSummary.total)}
          </button>
        </aside>
      </div>
    </>
  );
}
