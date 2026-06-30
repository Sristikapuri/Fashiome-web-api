'use client';

import { useEffect, useState } from 'react';
import {
  User,
  Settings,
  Shield,
  CreditCard,
  Bell,
  LogOut,
  ChevronRight,
  ReceiptText,
  X,
  MapPin,
  Phone,
  Mail,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ROUTES } from '@/lib/routes';
import { handleLogoutUser } from '@/lib/actions/auth-action';
import { handleGetMyOrders } from '@/lib/actions/order-actions';

const fallbackProfileImage = "/images/welcome/cat-formal.jpg";

function getProfileImageSrc(src?: string) {
  if (!src) return fallbackProfileImage;
  if (src.startsWith("blob:") || src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }
  return `/${src}`;
}

function resolveImage(value?: string) {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";
  return `${base}${value}`;
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(amount);
}

// ─── Status helpers ───────────────────────────────────────────────────────────
type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

const STATUS_STEPS: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered'];

const STATUS_META: Record<string, { label: string; color: string; bg: string; Icon: any }> = {
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-100 border-amber-300', Icon: Clock },
  paid: { label: 'Paid', color: 'text-blue-700', bg: 'bg-blue-100 border-blue-300', Icon: CreditCard },
  shipped: { label: 'Shipped', color: 'text-violet-700', bg: 'bg-violet-100 border-violet-300', Icon: Truck },
  delivered: { label: 'Delivered', color: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-300', Icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-100 border-red-300', Icon: XCircle },
};

// ─── Order Detail Modal ───────────────────────────────────────────────────────
function OrderDetailModal({ order, onClose }: { order: any; onClose: () => void }) {
  const items: any[] = Array.isArray(order.items) ? order.items : [];
  const status: OrderStatus = order.status ?? 'pending';
  const meta = STATUS_META[status] ?? STATUS_META.pending;
  const isCancelled = status === 'cancelled';
  const currentStep = STATUS_STEPS.indexOf(status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-[#260909] px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E7B8B8]">Order Details</p>
            <h2 className="mt-0.5 text-lg font-black text-white">
              #{String(order._id).slice(-8).toUpperCase()}
            </h2>
          </div>
          <button type="button" onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${meta.bg} ${meta.color}`}>
              <meta.Icon className="h-4 w-4" />
              {meta.label}
            </span>
            <span className="text-sm text-[#9A7E74]">
              {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              }) : ''}
            </span>
          </div>

          {/* Status Timeline */}
          {!isCancelled && (
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#9A7E74]">Order Progress</p>
              <div className="flex items-center gap-0">
                {STATUS_STEPS.map((step, idx) => {
                  const stepMeta = STATUS_META[step];
                  const done = idx <= currentStep;
                  const StepIcon = stepMeta.Icon;
                  return (
                    <div key={step} className="flex flex-1 items-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                          done ? 'border-[#820000] bg-[#820000] text-white' : 'border-[#E7B8B8] bg-white text-[#E7B8B8]'
                        }`}>
                          <StepIcon className="h-3.5 w-3.5" />
                        </div>
                        <span className={`text-[10px] font-bold ${done ? 'text-[#820000]' : 'text-[#C9B0B0]'}`}>
                          {stepMeta.label}
                        </span>
                      </div>
                      {idx < STATUS_STEPS.length - 1 && (
                        <div className={`mb-5 h-0.5 flex-1 transition-all ${
                          idx < currentStep ? 'bg-[#820000]' : 'bg-[#E7B8B8]'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Items */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#9A7E74]">Items Ordered</p>
            <div className="space-y-3">
              {items.map((item: any, idx: number) => {
                const image = resolveImage(item.imageUrl);
                return (
                  <div key={idx} className="flex items-center gap-4 rounded-2xl border border-[#E7B8B8] bg-[#FFF7F7] p-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-white shrink-0 border border-[#E7B8B8]">
                      {image ? (
                        <Image src={image} alt={item.name || 'Item'} fill unoptimized className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="h-6 w-6 text-[#E7B8B8]" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#260909] truncate">{item.name || 'Item'}</p>
                      {(item.size || item.color || item.category) && (
                        <p className="text-xs text-[#9A7E74]">
                          {[item.category, item.color, item.size].filter(Boolean).join(' • ')}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-[#735656]">
                        {formatMoney(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-black text-[#260909] shrink-0">
                      {formatMoney(item.price * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="rounded-2xl border border-[#E7B8B8] bg-[#FFF7F7] p-4 space-y-2 text-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A7E74] mb-3">Pricing</p>
            <div className="flex justify-between text-[#735656]">
              <span>Subtotal</span>
              <span>{formatMoney(Number(order.subtotal || 0))}</span>
            </div>
            <div className="flex justify-between text-[#735656]">
              <span>Tax (5%)</span>
              <span>{formatMoney(Number(order.tax || 0))}</span>
            </div>
            <div className="flex justify-between border-t border-[#E7B8B8] pt-2 font-black text-base text-[#260909]">
              <span>Total Paid</span>
              <span>{formatMoney(Number(order.total || 0))}</span>
            </div>
          </div>

          {/* Shipping & Payment */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Delivery */}
            <div className="rounded-2xl border border-[#E7B8B8] p-4 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-[#820000]" />
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A7E74]">Delivery</p>
              </div>
              {order.customerName && (
                <div className="flex items-center gap-2 text-sm text-[#260909]">
                  <User className="h-3.5 w-3.5 text-[#9A7E74]" />
                  <span>{order.customerName}</span>
                </div>
              )}
              {order.phone && (
                <div className="flex items-center gap-2 text-sm text-[#735656]">
                  <Phone className="h-3.5 w-3.5 text-[#9A7E74]" />
                  <span>{order.phone}</span>
                </div>
              )}
              {order.customerEmail && (
                <div className="flex items-center gap-2 text-sm text-[#735656]">
                  <Mail className="h-3.5 w-3.5 text-[#9A7E74]" />
                  <span className="truncate">{order.customerEmail}</span>
                </div>
              )}
              {order.shippingAddress && (
                <p className="text-sm text-[#735656] leading-relaxed">{order.shippingAddress}</p>
              )}
            </div>

            {/* Payment */}
            <div className="rounded-2xl border border-[#E7B8B8] p-4 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-[#820000]" />
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A7E74]">Payment</p>
              </div>
              {order.paymentMethod === 'esewa' ? (
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#60bb46] text-white font-black text-xs shrink-0">
                    e
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#260909]">eSewa</p>
                    {order.esewaRefId && (
                      <p className="text-xs text-[#9A7E74]">Ref: {order.esewaRefId}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-[#735656]" />
                  <p className="text-sm font-bold text-[#260909]">Cash on Delivery</p>
                </div>
              )}
              {order.esewaTransactionId && (
                <p className="text-xs text-[#9A7E74] break-all">
                  Txn: {order.esewaTransactionId}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ProfileTab ──────────────────────────────────────────────────────────
export function ProfileTab({ user }: { user: any }) {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const handleLogout = async () => {
    await handleLogoutUser();
    router.push('/login');
  };

  useEffect(() => {
    const loadOrders = async () => {
      setOrdersError('');
      try {
        const result = await handleGetMyOrders();
        const ordersData = Array.isArray(result.data)
          ? result.data
          : result.data?.orders || result.data?.data || result.data?.items || [];

        if (result.success) {
          setOrders(Array.isArray(ordersData) ? ordersData : []);
        } else {
          setOrders([]);
          setOrdersError(result.message || 'Failed to load orders');
        }
      } catch (error: any) {
        setOrders([]);
        setOrdersError(error?.message || 'Failed to load orders');
      } finally {
        setOrdersLoading(false);
      }
    };
    loadOrders();
  }, []);

  const menuItems = [
    { icon: Settings, label: 'Account Settings', color: 'text-blue-500', bg: 'bg-blue-100', href: ROUTES.profile },
    { icon: Shield, label: 'Privacy & Security', color: 'text-emerald-500', bg: 'bg-emerald-100', href: ROUTES.profileSecurity },
    { icon: CreditCard, label: 'Subscription', color: 'text-violet-500', bg: 'bg-violet-100', href: ROUTES.profileSubscription },
    { icon: ReceiptText, label: 'My Orders', color: 'text-red-500', bg: 'bg-red-100', href: '#orders-panel' },
    { icon: Bell, label: 'Notifications', color: 'text-orange-500', bg: 'bg-orange-100', href: ROUTES.profileNotifications },
  ];

  return (
    <>
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}

      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 border border-[#E7B8B8] shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FFECEC] to-white rounded-bl-full -z-10" />

          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#820000] to-[#A41515] p-1 shadow-lg shrink-0">
            <div className="w-full h-full rounded-full bg-white overflow-hidden">
              <Image
                src={getProfileImageSrc(user?.profileImage)}
                alt="Profile"
                width={128}
                height={128}
                unoptimized
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-[#260909] mb-2">{user?.firstName} {user?.lastName}</h1>
            <p className="text-[#735656] font-medium mb-4">{user?.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-4 py-1.5 bg-[#FFF7F7] border border-[#E7B8B8] rounded-full text-sm font-semibold text-[#820000]">
                Free Plan
              </span>
              <span className="px-4 py-1.5 bg-[#FFF7F7] border border-[#E7B8B8] rounded-full text-sm font-semibold text-[#820000]">
                Style Score: 88%
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push(`${ROUTES.profile}?section=edit`)}
            className="px-6 py-3 bg-[#820000] text-white font-bold rounded-xl hover:bg-[#A41515] transition-colors shadow-md w-full md:w-auto"
          >
            Edit Profile
          </button>
        </div>

          <div className="grid md:grid-cols-2 gap-8">
          {/* Settings Menu */}
            <div className="bg-white rounded-2xl border border-[#E7B8B8] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#E7B8B8] bg-[#FFF7F7]">
                <h2 className="text-lg font-bold text-[#260909]">Preferences</h2>
              </div>
            <div className="divide-y divide-[#E7B8B8]">
              {menuItems.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (item.href.startsWith('#')) {
                      document.getElementById('orders-panel')?.scrollIntoView({ behavior: 'smooth' });
                      return;
                    }
                    if (item.href.startsWith('#')) {
                      document.getElementById('orders-panel')?.scrollIntoView({ behavior: 'smooth' });
                      return;
                    }
                    router.push(item.href);
                  }}
                  className="w-full p-4 flex items-center justify-between hover:bg-[#FFF7F7] cursor-pointer transition-colors group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg}`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <span className="font-semibold text-[#260909]">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#E7B8B8] group-hover:text-[#820000] transition-colors" />
                </button>
              ))}
            </div>
          </div>

            {/* Style Profile */}
            <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E7B8B8] shadow-sm" id="profile-section-card">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A7E74]">Style Profile</p>
              <h2 className="text-lg font-bold text-[#260909] mb-2 mt-2">Silhouette and color profile</h2>
              <p className="text-sm text-[#735656] mb-4">
                Edit your body, face, and color details from the dedicated style profile page.
              </p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-[#735656]">Profile Completion</span>
                    <span className="font-bold text-[#820000]">100%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#FFECEC]">
                    <div className="h-full bg-gradient-to-r from-[#820000] to-[#A41515] w-full" />
                  </div>
                </div>
                <button
                  onClick={() => router.push('/silhouette')}
                  className="w-full py-2.5 bg-[#FFF7F7] border border-[#E7B8B8] text-[#820000] font-bold rounded-xl hover:bg-[#FFECEC] hover:border-[#820000] transition-colors"
                >
                  Edit Style Profile
                </button>
              </div>
            </div>

            <div className="bg-[#FFF7F7] rounded-2xl p-6 border border-[#E7B8B8] shadow-sm text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#E7B8B8]">
                <span className="text-3xl">👗</span>
              </div>
              <h3 className="font-bold text-[#260909] mb-2">Upgrade to Pro</h3>
              <p className="text-sm text-[#735656] mb-4">
                Get unlimited AI styling, priority support, and exclusive partner discounts.
              </p>
              <button
                type="button"
                onClick={() => router.push(`${ROUTES.profile}?section=subscription`)}
                className="w-full py-3 bg-[#260909] text-white font-bold rounded-xl hover:bg-black transition-colors shadow-md"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>

        {/* Orders Panel */}
        <div id="orders-panel" className="bg-white rounded-2xl border border-[#E7B8B8] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E7B8B8] bg-[#FFF7F7] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#260909]">Order History</h2>
              {!ordersLoading && orders.length > 0 && (
                <p className="text-sm text-[#9A7E74]">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
              )}
            </div>
            <ReceiptText className="w-5 h-5 text-[#820000]" />
          </div>

          <div className="p-6">
            {ordersLoading && (
              <div className="py-8 text-center text-[#735656]">Loading orders...</div>
            )}
            {!ordersLoading && ordersError && (
              <div className="py-8 text-center text-red-600">{ordersError}</div>
            )}
            {!ordersLoading && !ordersError && orders.length === 0 && (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF7F7] border border-[#E7B8B8]">
                  <Package className="h-7 w-7 text-[#C9B0B0]" />
                </div>
                <p className="font-semibold text-[#735656]">No orders yet</p>
                <p className="text-sm text-[#9A7E74] mt-1">Your completed orders will appear here.</p>
              </div>
            )}
            {!ordersLoading && !ordersError && orders.length > 0 && (
              <div className="space-y-4">
                {orders.map((order) => {
                  const items: any[] = Array.isArray(order.items) ? order.items : [];
                  const status: string = order.status ?? 'pending';
                  const meta = STATUS_META[status] ?? STATUS_META.pending;
                  const StatusIcon = meta.Icon;

                  return (
                    <div
                      key={order._id}
                      className="rounded-2xl border border-[#E7B8B8] bg-[#FFFDFD] p-5 hover:border-[#c59090] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-black text-[#260909]">
                            Order #{String(order._id).slice(-8).toUpperCase()}
                          </p>
                          <p className="text-sm text-[#9A7E74]">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : ''}
                          </p>
                        </div>
                        <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${meta.bg} ${meta.color}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {meta.label}
                        </span>
                      </div>

                      {/* Item thumbnails */}
                      <div className="mt-4 flex gap-2 overflow-x-auto">
                        {items.slice(0, 5).map((item: any, idx: number) => {
                          const image = resolveImage(item.imageUrl);
                          return (
                            <div
                              key={idx}
                              className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#E7B8B8] bg-[#FFF7F7]"
                            >
                              {image ? (
                                <Image src={image} alt={item.name || 'Item'} fill unoptimized className="object-cover" />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <Package className="h-5 w-5 text-[#E7B8B8]" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {items.length > 5 && (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E7B8B8] bg-[#FFF7F7] text-xs font-bold text-[#9A7E74]">
                            +{items.length - 5}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-[#735656]">
                          <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
                          <span className="font-black text-[#260909]">
                            {formatMoney(Number(order.total || 0))}
                          </span>
                          {order.paymentMethod === 'esewa' && (
                            <span className="flex items-center gap-1 rounded-full bg-[#e8f7e4] border border-[#60bb46]/30 px-2 py-0.5 text-xs font-bold text-[#3d7a2b]">
                              <span className="h-3.5 w-3.5 flex items-center justify-center rounded-full bg-[#60bb46] text-white text-[8px] font-black">e</span>
                              eSewa
                            </span>
                          )}
                          {order.paymentMethod === 'cod' && (
                            <span className="flex items-center gap-1 rounded-full bg-[#FFF7F7] border border-[#E7B8B8] px-2 py-0.5 text-xs font-bold text-[#735656]">
                              <Truck className="h-3 w-3" />
                              COD
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-xl border border-[#E7B8B8] bg-white px-4 py-2 text-sm font-bold text-[#820000] hover:bg-[#FFF7F7] transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 text-[#A41515] font-bold rounded-xl hover:bg-[#FFF7F7] transition-colors border border-transparent hover:border-[#E7B8B8]"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
