"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  CreditCard,
  Truck,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Package,
  Eye,
  X,
  MapPin,
  Phone,
  Mail,
  User,
  Banknote,
  Wallet,
  Receipt,
} from "lucide-react";
import {
  handleGetAllOrders,
  handleUpdateOrderStatus,
} from "@/lib/actions/admin/order-action";
import type { AdminOrder, OrderStats, OrderStatus } from "@/lib/api/admin/orders";



const STATUS_OPTS: { value: string; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_OPTS: { value: string; label: string }[] = [
  { value: "", label: "All Methods" },
  { value: "cod", label: "Cash on Delivery" },
  { value: "esewa", label: "eSewa" },
];

const STATUS_FLOW: OrderStatus[] = ["pending", "paid", "shipped", "delivered"];

const STATUS_META: Record<
  string,
  { label: string; color: string; bg: string; border: string; dot: string; Icon: any }
> = {
  pending: {
    label: "Pending",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-400",
    Icon: Clock,
  },
  paid: {
    label: "Paid",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
    Icon: CreditCard,
  },
  shipped: {
    label: "Shipped",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    dot: "bg-violet-500",
    Icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    Icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
    Icon: XCircle,
  },
};

function fmt(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

function resolveImage(value?: string) {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";
  return `${base}${value}`;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? STATUS_META.pending;
  const Icon = meta.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${meta.bg} ${meta.border} ${meta.color}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      <Icon className="h-3 w-3" />
      {meta.label}
    </span>
  );
}

// ─── Order Detail Modal ───────────────────────────────────────────────────────

function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
}: {
  order: AdminOrder;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => Promise<void>;
}) {
  const [updating, startUpdate] = useTransition();
  const [localStatus, setLocalStatus] = useState<OrderStatus>(order.status);
  const items = order.items ?? [];
  const currentStep = STATUS_FLOW.indexOf(localStatus);

  const handleStatusChange = (newStatus: OrderStatus) => {
    startUpdate(async () => {
      await onStatusChange(order._id, newStatus);
      setLocalStatus(newStatus);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 flex w-full max-w-2xl flex-col rounded-[2rem] bg-white shadow-2xl max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-[2rem] bg-[#260909] px-7 py-5 shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E7B8B8]">
              Order Details
            </p>
            <h2 className="mt-1 text-xl font-black text-white">
              #{String(order._id).slice(-10).toUpperCase()}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          <div className="space-y-6 p-7">
            {/* Status + Date */}
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={localStatus} />
              <span className="text-sm text-[#9A7E74]">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </span>
            </div>

            {/* Progress Timeline */}
            {localStatus !== "cancelled" && (
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A7E74]">
                  Order Progress
                </p>
                <div className="flex items-center">
                  {STATUS_FLOW.map((step, idx) => {
                    const meta = STATUS_META[step];
                    const done = idx <= currentStep;
                    const StepIcon = meta.Icon;
                    return (
                      <div key={step} className="flex flex-1 items-center">
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                              done
                                ? "border-[#820000] bg-[#820000] text-white"
                                : "border-[#E7B8B8] bg-white text-[#E7B8B8]"
                            }`}
                          >
                            <StepIcon className="h-4 w-4" />
                          </div>
                          <span
                            className={`text-[10px] font-bold ${
                              done ? "text-[#820000]" : "text-[#C9B0B0]"
                            }`}
                          >
                            {meta.label}
                          </span>
                        </div>
                        {idx < STATUS_FLOW.length - 1 && (
                          <div
                            className={`mb-5 h-0.5 flex-1 transition-all ${
                              idx < currentStep ? "bg-[#820000]" : "bg-[#E7B8B8]"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Update Status */}
            <div className="rounded-2xl border border-[#E7B8B8] bg-[#FFF7F7] p-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A7E74]">
                Update Status
              </p>
              <div className="flex flex-wrap gap-2">
                {(["pending", "paid", "shipped", "delivered", "cancelled"] as OrderStatus[]).map(
                  (s) => {
                    const meta = STATUS_META[s];
                    const active = localStatus === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={updating || active}
                        onClick={() => handleStatusChange(s)}
                        className={`rounded-xl border px-4 py-2 text-xs font-bold transition ${
                          active
                            ? `${meta.bg} ${meta.border} ${meta.color} cursor-default`
                            : "border-[#E7B8B8] bg-white text-[#735656] hover:border-[#820000] hover:text-[#820000]"
                        } disabled:opacity-60`}
                      >
                        {meta.label}
                      </button>
                    );
                  }
                )}
              </div>
              {updating && (
                <p className="mt-2 text-xs text-[#9A7E74] animate-pulse">Updating…</p>
              )}
            </div>

            {/* Customer Info */}
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A7E74]">
                Customer
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  {
                    Icon: User,
                    label: order.customerDisplayName || order.customerName || "Unknown",
                  },
                  ...(order.customerEmail
                    ? [{ Icon: Mail, label: order.customerEmail }]
                    : []),
                  ...(order.phone ? [{ Icon: Phone, label: order.phone }] : []),
                  {
                    Icon: MapPin,
                    label: order.shippingAddress,
                  },
                ].map(({ Icon, label }, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-[#E7B8B8] bg-white p-3"
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#820000]" />
                    <span className="text-sm text-[#260909]">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="flex items-center gap-3 rounded-2xl border border-[#E7B8B8] bg-white p-4">
              {order.paymentMethod === "esewa" ? (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#60bb46] font-black text-white text-sm">
                  e
                </div>
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF7F7] text-[#820000]">
                  <Banknote className="h-5 w-5" />
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-[#260909]">
                  {order.paymentMethod === "esewa" ? "eSewa" : "Cash on Delivery"}
                </p>
                {order.esewaTransactionId && (
                  <p className="text-[10px] text-[#9A7E74]">
                    Txn: {order.esewaTransactionId}
                  </p>
                )}
              </div>
              <div className="ml-auto text-right">
                <p className="text-[10px] text-[#9A7E74]">Total</p>
                <p className="text-lg font-black text-[#260909]">{fmt(order.total)}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A7E74]">
                Items Ordered ({items.length})
              </p>
              <div className="space-y-2">
                {items.map((item, idx) => {
                  const img = resolveImage(item.imageUrl);
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-4 rounded-2xl border border-[#E7B8B8] bg-[#FFF7F7] p-3"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#E7B8B8] bg-white">
                        {img ? (
                          <Image
                            src={img}
                            alt={item.name || "Item"}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package className="h-6 w-6 text-[#E7B8B8]" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-[#260909]">
                          {item.name || "Item"}
                        </p>
                        <p className="text-xs text-[#9A7E74]">Qty: {item.quantity}</p>
                      </div>
                      <p className="shrink-0 font-bold text-[#260909]">
                        {fmt(item.price * item.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="rounded-2xl border border-[#E7B8B8] bg-[#FFF7F7] p-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A7E74]">
                Pricing
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#735656]">
                  <span>Subtotal</span>
                  <span>{fmt(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#735656]">
                  <span>Tax (5%)</span>
                  <span>{fmt(order.tax)}</span>
                </div>
                <div className="flex justify-between border-t border-[#E7B8B8] pt-2 font-black text-[#260909]">
                  <span>Total</span>
                  <span>{fmt(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Card ───────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: any;
  accent: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-[#e7c7bc] bg-white/85 p-5 shadow-[0_8px_30px_rgba(36,22,18,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9a7e74]">
            {label}
          </p>
          <p className={`mt-2 text-3xl font-black tracking-tight ${accent}`}>{value}</p>
          {sub && <p className="mt-1 text-xs text-[#6f574f]">{sub}</p>}
        </div>
        <span className={`inline-flex rounded-2xl bg-[#fff6f2] p-3 ${accent}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function AdminOrdersPanel({
  initialOrders,
  initialMeta,
  initialStats,
}: {
  initialOrders: AdminOrder[];
  initialMeta: { page: number; limit: number; total: number; totalPages: number };
  initialStats: OrderStats | null;
}) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [meta, setMeta] = useState(initialMeta);
  const [stats, setStats] = useState<OrderStats | null>(initialStats);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [loading, startLoad] = useTransition();

  const fetchOrders = (p: number, status: string, payment: string) => {
    startLoad(async () => {
      const result = await handleGetAllOrders({
        page: p,
        limit: 15,
        status: status || undefined,
        paymentMethod: payment || undefined,
      });
      if (result.success && result.data) {
        setOrders(result.data);
        setMeta(result.meta ?? meta);
        setPage(p);
      }
    });
  };

  const applyFilter = () => {
    fetchOrders(1, filterStatus, filterPayment);
  };

  const handlePageChange = (newPage: number) => {
    fetchOrders(newPage, filterStatus, filterPayment);
  };

  const handleStatusUpdate = async (id: string, status: OrderStatus) => {
    const result = await handleUpdateOrderStatus(id, status);
    if (result.success) {
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );
      if (selectedOrder?._id === id) {
        setSelectedOrder((prev) => (prev ? { ...prev, status } : prev));
      }
    }
  };

  const s = stats;

  return (
    <>
      <section className="mx-auto w-full max-w-7xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a7e74]">
              Admin Panel
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-[#311812]">
              Order Management
            </h1>
            <p className="mt-1 text-sm text-[#6f574f]">
              View, filter, and update all customer orders in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={() => fetchOrders(page, filterStatus, filterPayment)}
            className="flex items-center gap-2 rounded-2xl border border-[#e7c7bc] bg-white px-4 py-2.5 text-xs font-bold text-[#6f574f] transition hover:border-[#a43a24] hover:text-[#a43a24]"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Stats Row */}
        {s && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Orders"
              value={s.totalOrders}
              sub={`${s.codOrders} COD · ${s.esewaOrders} eSewa`}
              icon={ShoppingBag}
              accent="text-[#a43a24]"
            />
            <StatCard
              label="Revenue"
              value={fmt(s.totalRevenue)}
              sub="All completed orders"
              icon={TrendingUp}
              accent="text-emerald-700"
            />
            <StatCard
              label="Pending"
              value={s.pendingOrders}
              sub={`Paid: ${s.paidOrders} · Shipped: ${s.shippedOrders}`}
              icon={Clock}
              accent="text-amber-700"
            />
            <StatCard
              label="Delivered"
              value={s.deliveredOrders}
              sub={`Cancelled: ${s.cancelledOrders}`}
              icon={CheckCircle2}
              accent="text-blue-700"
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-3 rounded-[1.75rem] border border-[#e7c7bc] bg-white/85 p-5 shadow-[0_8px_30px_rgba(36,22,18,0.04)]">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9a7e74]">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </div>
          <div className="flex flex-1 flex-wrap gap-3">
            <select
              id="admin-order-status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-[#e7c7bc] bg-[#fffaf7] px-4 py-2.5 text-sm text-[#311812] outline-none focus:border-[#a43a24] focus:ring-2 focus:ring-[#a43a24]/10"
            >
              {STATUS_OPTS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              id="admin-order-payment-filter"
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="rounded-xl border border-[#e7c7bc] bg-[#fffaf7] px-4 py-2.5 text-sm text-[#311812] outline-none focus:border-[#a43a24] focus:ring-2 focus:ring-[#a43a24]/10"
            >
              {PAYMENT_OPTS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={applyFilter}
              disabled={loading}
              className="rounded-xl bg-[#820000] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#a43a24] disabled:opacity-60"
            >
              Apply
            </button>
            {(filterStatus || filterPayment) && (
              <button
                type="button"
                onClick={() => {
                  setFilterStatus("");
                  setFilterPayment("");
                  fetchOrders(1, "", "");
                }}
                className="rounded-xl border border-[#e7c7bc] px-4 py-2.5 text-sm font-bold text-[#6f574f] transition hover:border-[#a43a24] hover:text-[#a43a24]"
              >
                Clear
              </button>
            )}
          </div>
          <p className="ml-auto text-xs text-[#9a7e74]">
            {meta.total} order{meta.total !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-[1.75rem] border border-[#e7c7bc] bg-white/85 shadow-[0_8px_30px_rgba(36,22,18,0.06)]">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-[#9a7e74]">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
              <Receipt className="h-10 w-10 text-[#E7B8B8]" />
              <p className="text-sm font-bold text-[#9a7e74]">No orders found</p>
              <p className="text-xs text-[#B8A0A0]">
                Try adjusting your filters or check back later.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#f0d8d0] bg-[#fffaf7] text-left">
                      {["Order ID", "Customer", "Items", "Payment", "Total", "Status", "Date", ""].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9a7e74]"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, idx) => (
                      <tr
                        key={order._id}
                        className={`border-b border-[#f8f0ec] transition hover:bg-[#fffaf7] ${
                          idx % 2 === 0 ? "bg-white" : "bg-[#fffcfa]"
                        }`}
                      >
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs font-bold text-[#a43a24]">
                            #{String(order._id).slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-[#311812]">
                            {order.customerDisplayName || order.customerName || "Unknown"}
                          </p>
                          {order.customerEmail && (
                            <p className="text-xs text-[#9a7e74]">{order.customerEmail}</p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex -space-x-2">
                            {order.items.slice(0, 3).map((item, i) => {
                              const img = resolveImage(item.imageUrl);
                              return (
                                <div
                                  key={i}
                                  className="relative h-9 w-9 overflow-hidden rounded-xl border-2 border-white bg-[#FFF7F7]"
                                  title={item.name}
                                >
                                  {img ? (
                                    <Image
                                      src={img}
                                      alt={item.name}
                                      fill
                                      unoptimized
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full items-center justify-center">
                                      <Package className="h-3.5 w-3.5 text-[#E7B8B8]" />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            {order.items.length > 3 && (
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-white bg-[#FFF7F7] text-[10px] font-bold text-[#9a7e74]">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-[#9a7e74]">
                            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          {order.paymentMethod === "esewa" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0fbee] px-3 py-1 text-xs font-bold text-[#3d7a2b]">
                              <Wallet className="h-3 w-3" />
                              eSewa
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF7F7] px-3 py-1 text-xs font-bold text-[#735656]">
                              <Banknote className="h-3 w-3" />
                              COD
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 font-black text-[#311812]">
                          {fmt(order.total)}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-5 py-4 text-xs text-[#9a7e74]">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            id={`view-order-${order._id}`}
                            onClick={() => setSelectedOrder(order)}
                            className="flex items-center gap-1.5 rounded-xl border border-[#e7c7bc] bg-white px-3 py-2 text-xs font-bold text-[#6f574f] transition hover:border-[#a43a24] hover:text-[#a43a24]"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="space-y-3 p-4 md:hidden">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="rounded-2xl border border-[#e7c7bc] bg-[#fffaf7] p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-mono text-xs font-bold text-[#a43a24]">
                          #{String(order._id).slice(-8).toUpperCase()}
                        </p>
                        <p className="mt-0.5 font-bold text-[#311812]">
                          {order.customerDisplayName || "Unknown"}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xs text-[#9a7e74]">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·{" "}
                        {order.paymentMethod === "esewa" ? "eSewa" : "COD"}
                      </div>
                      <p className="font-black text-[#311812]">{fmt(order.total)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e7c7bc] bg-white py-2.5 text-xs font-bold text-[#6f574f] transition hover:border-[#a43a24] hover:text-[#a43a24]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View & Manage
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#f0d8d0] px-6 py-4">
              <p className="text-xs text-[#9a7e74]">
                Page {meta.page} of {meta.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={meta.page <= 1 || loading}
                  onClick={() => handlePageChange(meta.page - 1)}
                  className="flex items-center gap-1 rounded-xl border border-[#e7c7bc] px-3 py-2 text-xs font-bold text-[#6f574f] transition hover:border-[#a43a24] hover:text-[#a43a24] disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Prev
                </button>
                <button
                  type="button"
                  disabled={meta.page >= meta.totalPages || loading}
                  onClick={() => handlePageChange(meta.page + 1)}
                  className="flex items-center gap-1 rounded-xl border border-[#e7c7bc] px-3 py-2 text-xs font-bold text-[#6f574f] transition hover:border-[#a43a24] hover:text-[#a43a24] disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusUpdate}
        />
      )}
    </>
  );
}
