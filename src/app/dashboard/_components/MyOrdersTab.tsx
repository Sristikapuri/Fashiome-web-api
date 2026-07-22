"use client";

import { useEffect, useState } from "react";
import { Package, Clock, CheckCircle, Truck, MapPin, Phone, Mail, CreditCard, Calendar, User } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { handleGetMyOrders } from "@/lib/actions/order-actions";
import { handleVerifyEsewaPayment } from "@/lib/actions/esewa-action";
import { formatMoney } from "@/lib/pricing";
import { resolveApiImageUrl } from "@/lib/image-url";

type OrderItem = {
  clotheId: string;
  quantity: number;
  price: number;
  name?: string;
  imageUrl?: string;
  category?: string;
};

type Order = {
  _id: string;
  items: OrderItem[];
  shippingAddress: string;
  customerName?: string;
  customerEmail?: string;
  phone?: string;
  city?: string;
  postalCode?: string;
  paymentMethod?: string;
  subtotal: number;
  tax: number;
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
};

const statusConfig = {
  pending: { label: "Pending", color: "bg-[#FFECEC] text-[#820000]", icon: Clock },
  paid: { label: "Paid", color: "bg-[#E7B8B8] text-[#4A0000]", icon: CheckCircle },
  shipped: { label: "Shipped", color: "bg-[#D86B6B] text-white", icon: Truck },
  delivered: { label: "Delivered", color: "bg-[#820000] text-white", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-[#FFDADA] text-[#4A0000]", icon: Package },
};

export default function MyOrdersTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; message: string } | null>(null);

  const loadOrders = async () => {
    try {
      const result = await handleGetMyOrders();
      if (result.success && result.data) {
        const ordersData = result.data.orders || [];
        setOrders(ordersData);
      } else {
        setError(result.message || "Failed to load orders");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // The request is an external synchronization; it must not run during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadOrders();
  }, []);

  useEffect(() => {
    const checkPaymentParam = async () => {
      const payment = searchParams.get("payment");
      const orderId = searchParams.get("orderId");
      const amountStr = searchParams.get("amount") || searchParams.get("amt");
      const refId = searchParams.get("refId") || searchParams.get("rid") || searchParams.get("ref_id");
      const data = searchParams.get("data");

      if (payment === "success" && orderId && data) {
        setVerifyingPayment(true);
        try {
          const verifyRes = await handleVerifyEsewaPayment({
            amount: Number(amountStr),
            orderId,
            refId: refId || "",
            data,
          });
          if (verifyRes.success) {
            setVerificationResult({ success: true, message: "eSewa Payment verified successfully!" });
            loadOrders();
          } else {
            setVerificationResult({ success: false, message: verifyRes.message || "Payment verification failed." });
          }
        } catch (err: any) {
          setVerificationResult({ success: false, message: err?.message || "Payment verification failed." });
        } finally {
          setVerifyingPayment(false);
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.delete("payment");
          newParams.delete("orderId");
          newParams.delete("amount");
          newParams.delete("amt");
          newParams.delete("refId");
          newParams.delete("rid");
          newParams.delete("ref_id");
          newParams.delete("data");
          router.replace(`/dashboard?tab=orders&${newParams.toString()}`);
        }
      } else if (payment === "failed") {
        setVerificationResult({ success: false, message: "eSewa payment was cancelled or failed." });
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete("payment");
        newParams.delete("orderId");
        router.replace(`/dashboard?tab=orders&${newParams.toString()}`);
      }
    };

    checkPaymentParam();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-[#820000] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[#E7B8B8] bg-white p-8 text-center">
        <Package className="mx-auto h-12 w-12 text-[#820000] mb-4" />
        <h2 className="text-xl font-bold text-[#260909] mb-2">Error Loading Orders</h2>
        <p className="text-[#735656]">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Payment Verification Alerts */}
      {verificationResult && (
        <div className={`rounded-2xl border p-4 flex items-start gap-3 ${
          verificationResult.success
            ? "border-[#820000] bg-[#FFECEC] text-[#820000]"
            : "border-[#FFDADA] bg-[#FFDADA] text-[#4A0000]"
        }`}>
          <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">{verificationResult.success ? "Payment Successful" : "Payment Verification Issue"}</p>
            <p className="text-sm">{verificationResult.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setVerificationResult(null)}
            className="text-xs font-semibold underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {verifyingPayment && (
        <div className="rounded-2xl border border-[#820000] bg-[#FFECEC] p-6 text-center animate-pulse">
          <div className="w-8 h-8 border-4 border-[#820000] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="font-bold text-[#820000]">Verifying eSewa Payment</p>
          <p className="text-sm text-[#735656]">Please do not refresh or close this window.</p>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#260909]">My Orders</h2>
        <p className="text-[#735656] mt-1">Track and manage your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-[#E7B8B8] bg-white p-8 text-center">
          <Package className="mx-auto h-16 w-16 text-[#820000] mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-[#260909] mb-2">No Orders Yet</h2>
          <p className="text-[#735656] mb-4">You haven&apos;t placed any orders yet. Start shopping to see your orders here!</p>
        </div>
      ) : (
        <div className="space-y-4">
        {orders.map((order) => {
          const statusInfo = statusConfig[order.status] || statusConfig.pending;
          const StatusIcon = statusInfo.icon;
          const date = new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return (
            <div
              key={order._id}
              className="rounded-2xl border border-[#E7B8B8] bg-white overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-[#735656]">Order #{order._id.slice(-8)}</span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#735656]">
                      <Calendar className="h-4 w-4" />
                      {date}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-[#260909]">{formatMoney(order.total)}</p>
                    <p className="text-sm text-[#735656]">{order.items.length} item(s)</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-[#260909] px-6 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E7B8B8]">Order Details</p>
                <h2 className="mt-0.5 text-xl font-black text-white">Order #{selectedOrder._id.slice(-8)}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
              >
                <Package className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between rounded-2xl bg-[#FFF7F7] p-4">
                <div>
                  <p className="text-sm text-[#735656]">Order Status</p>
                  <p className="text-lg font-bold text-[#260909] capitalize">{selectedOrder.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#735656]">Order Date</p>
                  <p className="text-lg font-bold text-[#260909]">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Customer Details */}
              <div className="rounded-2xl border border-[#E7B8B8] bg-white p-4">
                <h3 className="font-bold text-[#260909] mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-[#820000]" />
                  Customer Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedOrder.customerName && (
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-[#735656]" />
                      <div>
                        <p className="text-xs text-[#735656]">Name</p>
                        <p className="font-semibold text-[#260909]">{selectedOrder.customerName}</p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.customerEmail && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-[#735656]" />
                      <div>
                        <p className="text-xs text-[#735656]">Email</p>
                        <p className="font-semibold text-[#260909]">{selectedOrder.customerEmail}</p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-[#735656]" />
                      <div>
                        <p className="text-xs text-[#735656]">Phone</p>
                        <p className="font-semibold text-[#260909]">{selectedOrder.phone}</p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.paymentMethod && (
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4 text-[#735656]" />
                      <div>
                        <p className="text-xs text-[#735656]">Payment Method</p>
                        <p className="font-semibold text-[#260909] uppercase">{selectedOrder.paymentMethod}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="rounded-2xl border border-[#E7B8B8] bg-white p-4">
                <h3 className="font-bold text-[#260909] mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#820000]" />
                  Shipping Address
                </h3>
                <p className="text-[#260909]">{selectedOrder.shippingAddress}</p>
                {selectedOrder.city && selectedOrder.postalCode && (
                  <p className="text-[#735656] mt-1">
                    {selectedOrder.city}, {selectedOrder.postalCode}
                  </p>
                )}
              </div>

              {/* Order Items */}
              <div className="rounded-2xl border border-[#E7B8B8] bg-white p-4">
                <h3 className="font-bold text-[#260909] mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-[#820000]" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-[#FFF7F7]">
                      {item.imageUrl && (
                        <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-white">
                          <Image
                            src={resolveApiImageUrl(item.imageUrl) || "/images/welcome/hero-gown.jpg"}
                            alt={item.name || "Product"}
                            fill
                            sizes="64px"
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-[#260909]">{item.name || "Product"}</p>
                        <p className="text-sm text-[#735656]">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-[#820000]">{formatMoney(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="rounded-2xl border border-[#E7B8B8] bg-[#FFF7F7] p-4">
                <h3 className="font-bold text-[#260909] mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#735656]">Subtotal</span>
                    <span className="font-semibold text-[#260909]">{formatMoney(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#735656]">Tax</span>
                    <span className="font-semibold text-[#260909]">{formatMoney(selectedOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-[#E7B8B8] pt-2">
                    <span className="text-[#260909]">Total</span>
                    <span className="text-[#820000]">{formatMoney(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
