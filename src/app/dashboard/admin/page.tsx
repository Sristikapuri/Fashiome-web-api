import Link from "next/link";
import Image from "next/image";
import { handleGetAllUsers } from "@/lib/actions/admin/user-action";
import { handleGetAllClothes } from "@/lib/actions/admin/clothes-action";
import { handleGetOrderStats } from "@/lib/actions/admin/order-action";
import { ROUTES } from "@/lib/routes";
import { getApiBaseUrl } from "@/lib/api/base-url";
import {
  ArrowRight,
  BadgeCheck,
  Crown,
  Sparkles,
  Shirt,
  ShoppingBag,
  Users,
  WandSparkles,
} from "lucide-react";

const CARDS = [
  {
    href: ROUTES.admin,
    label: "Fashion operations",
    desc: "High level control for your clothing and personalization workspace.",
    icon: Crown,
  },
  {
    href: ROUTES.adminUsers,
    label: "Users",
    desc: "Manage accounts, status, and customer identity data for styling and personalization.",
    icon: Users,
  },
  {
    href: ROUTES.adminClothes,
    label: "Clothes",
    desc: "Create and manage your catalog of clothes, prices, stock, and product images.",
    icon: WandSparkles,
  },
  {
    href: `${ROUTES.adminClothes}?mode=inventory`,
    label: "Inventory",
    desc: "Review stock, status, and availability for every clothing item.",
    icon: Shirt,
  },
  {
    href: ROUTES.adminOrders,
    label: "Orders",
    desc: "View and manage all customer orders. Update statuses, check payment types, and track fulfillment.",
    icon: ShoppingBag,
  },
];

const ACTIONS = [
  "Keep customer profiles clean so recommendations stay accurate.",
  "Review inactive accounts when onboarding or login issues appear.",
  "Use role management carefully to protect the admin workspace.",
];

const FUTURE_PANELS = [
  "Outfit catalog and collection management",
  "Recommendation analytics and click-through tracking",
  "Onboarding and silhouette profile moderation",
];

export default async function AdminHomePage() {
  const [usersResult, clothesResult, statsResult] = await Promise.all([
    handleGetAllUsers({ page: 1, limit: 1 }),
    handleGetAllClothes({ page: 1, limit: 4, search: "" }),
    handleGetOrderStats(),
  ]);
  const totalUsers = usersResult.success && usersResult.pagination ? usersResult.pagination.total : 0;
  const featuredClothes = clothesResult.success && clothesResult.data ? clothesResult.data.slice(0, 4) : [];
  const orderStats = statsResult.success && statsResult.data ? statsResult.data : null;

  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="mb-8 overflow-hidden rounded-[2rem] border border-[#e7c7bc] bg-[radial-gradient(circle_at_top_right,_rgba(164,58,36,0.08),_transparent_35%),linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(255,249,245,0.96))] p-6 shadow-[0_20px_60px_rgba(36,22,18,0.08)] md:p-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f0d8d0] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#a43a24]">
          <Sparkles className="h-3.5 w-3.5" />
          Fashion operations
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">
          Admin panel
        </p>
        <h2 className="mt-2 text-4xl font-black tracking-tight text-[#311812]">
          Style studio control room
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f574f]">
          Manage the people, catalog, and operational data that power your
          clothing recommendation experience. This workspace is built to feel
          like a fashion backend, not a generic admin panel.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.75rem] border border-[#e7c7bc] bg-white/85 p-5 shadow-[0_16px_50px_rgba(36,22,18,0.06)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Users</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-black tracking-tight text-[#311812]">{totalUsers}</p>
              <p className="mt-1 text-sm text-[#6f574f]">Active user records</p>
            </div>
            <span className="inline-flex rounded-2xl bg-[#fff6f2] p-3 text-[#a43a24]">
              <Users className="h-5 w-5" />
            </span>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[#e7c7bc] bg-white/85 p-5 shadow-[0_16px_50px_rgba(36,22,18,0.06)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Total Orders</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-black tracking-tight text-[#311812]">
                {orderStats ? orderStats.totalOrders : "—"}
              </p>
              <p className="mt-1 text-sm text-[#6f574f]">
                {orderStats ? `${orderStats.pendingOrders} pending · ${orderStats.paidOrders} paid` : "Loading…"}
              </p>
            </div>
            <span className="inline-flex rounded-2xl bg-[#fff6f2] p-3 text-[#a43a24]">
              <ShoppingBag className="h-5 w-5" />
            </span>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[#e7c7bc] bg-white/85 p-5 shadow-[0_16px_50px_rgba(36,22,18,0.06)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Revenue</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-black tracking-tight text-[#311812]">
                {orderStats
                  ? `$${Number(orderStats.totalRevenue).toFixed(0)}`
                  : "—"}
              </p>
              <p className="mt-1 text-sm text-[#6f574f]">
                {orderStats ? `${orderStats.esewaOrders} eSewa · ${orderStats.codOrders} COD` : "Loading…"}
              </p>
            </div>
            <span className="inline-flex rounded-2xl bg-[#fff6f2] p-3 text-[#a43a24]">
              <BadgeCheck className="h-5 w-5" />
            </span>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[#e7c7bc] bg-white/85 p-5 shadow-[0_16px_50px_rgba(36,22,18,0.06)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Delivered</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-black tracking-tight text-[#311812]">
                {orderStats ? orderStats.deliveredOrders : "—"}
              </p>
              <p className="mt-1 text-sm text-[#6f574f]">
                {orderStats ? `${orderStats.shippedOrders} shipped` : "Loading…"}
              </p>
            </div>
            <span className="inline-flex rounded-2xl bg-[#fff6f2] p-3 text-[#a43a24]">
              <Crown className="h-5 w-5" />
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {CARDS.map(({ href, label, desc, icon: Icon }) => (
          <Link
            key={`${href}-${label}`}
            href={href}
            className="group rounded-[1.75rem] border border-[#e7c7bc] bg-white/85 p-6 shadow-[0_16px_50px_rgba(36,22,18,0.06)] transition hover:-translate-y-0.5 hover:border-[#a43a24]"
          >
            <div className="mb-4 inline-flex rounded-2xl bg-[#fff6f2] p-3 text-[#a43a24]">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-black text-[#311812]">{label}</h3>
            <p className="mt-2 text-sm leading-6 text-[#6f574f]">{desc}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#a43a24]">
              Manage
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[1.75rem] border border-[#e7c7bc] bg-white/85 p-6 shadow-[0_16px_50px_rgba(36,22,18,0.06)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">What this admin area is for</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[#6f574f]">
            {ACTIONS.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#a43a24]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.75rem] border border-[#e7c7bc] bg-white/85 p-6 shadow-[0_16px_50px_rgba(36,22,18,0.06)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Recommended next sections</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[#6f574f]">
            {FUTURE_PANELS.map((item) => (
              <li key={item} className="rounded-2xl bg-[#fff6f2] px-4 py-3 text-[#311812]">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-[1.75rem] border border-[#e7c7bc] bg-white/85 p-6 shadow-[0_16px_50px_rgba(36,22,18,0.06)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">
              Featured clothes
            </p>
            <h3 className="mt-1 text-2xl font-black tracking-tight text-[#311812]">
              Recommended items for the storefront
            </h3>
          </div>
          <Link
            href={ROUTES.adminClothes}
            className="text-xs font-bold uppercase tracking-[0.18em] text-[#a43a24] transition hover:text-[#8f3120]"
          >
            Manage catalog
          </Link>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredClothes.length ? (
            featuredClothes.map((item) => (
              <Link
                key={item._id}
                href={`/dashboard/admin/clothes/${item._id}`}
                className="group overflow-hidden rounded-[1.5rem] border border-[#f0d8d0] bg-[#fffaf7] transition hover:-translate-y-0.5 hover:border-[#a43a24]"
              >
                <div className="relative aspect-[4/5] bg-[linear-gradient(180deg,_#fff6f2,_#fff)]">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl.startsWith("http") ? item.imageUrl : `${getApiBaseUrl()}${item.imageUrl}`}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs font-bold uppercase tracking-[0.2em] text-[#9a7e74]">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9a7e74]">
                    {item.category}
                  </p>
                  <h4 className="mt-1 text-lg font-black text-[#311812]">{item.name}</h4>
                  <p className="mt-1 text-sm text-[#6f574f]">
                    {item.description || "Featured catalog item"}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="font-bold text-[#a43a24]">${Number(item.price).toFixed(2)}</span>
                    <span className="rounded-full bg-[#fff6f2] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#6f574f]">
                      {item.status || "active"}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#e7c7bc] p-6 text-sm text-[#6f574f] md:col-span-2 xl:col-span-4">
              Add clothes items to see featured catalog cards here.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
