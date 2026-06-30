import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { handleGetClotheById } from "@/lib/actions/admin/clothes-action";
import { calculatePriceBreakdown, formatMoney } from "@/lib/pricing";

function resolveImage(value?: string) {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";
  return `${base}${value}`;
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await handleGetClotheById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const item = result.data;
  const image = resolveImage(item.imageUrl);
  const priceSummary = calculatePriceBreakdown({
    price: Number(item.price),
    quantity: 1,
    discountPercent: item.status === "inactive" ? 0 : 10,
    taxPercent: 5,
    discountedPrice: item.discountedPrice ?? null,
  });

  const rows: [string, string][] = [
    ["Name", item.name],
    ["Category", item.category],
    ["Size", item.size],
    ["Color", item.color],
    ["Unit Price", formatMoney(priceSummary.unitPrice)],
    ["Discounted Price", item.discountedPrice !== null && item.discountedPrice !== undefined ? formatMoney(item.discountedPrice) : "—"],
    ["Subtotal", formatMoney(priceSummary.subtotal)],
    ["Discount", `-${formatMoney(priceSummary.discountAmount)}`],
    ["Tax", formatMoney(priceSummary.taxAmount)],
    ["Total", formatMoney(priceSummary.total)],
    ["Stock", String(item.stock)],
    ["Status", item.status || "active"],
    ["Description", item.description || "—"],
    ["Created", item.createdAt ? new Date(item.createdAt).toLocaleString() : "—"],
    ["Updated", item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "—"],
  ];

  return (
    <section className="mx-auto w-full max-w-4xl">
      <Link
        href="/dashboard/admin/clothes"
        className="text-xs font-bold uppercase tracking-[0.18em] text-[#6f574f] transition hover:text-[#311812]"
      >
        ← Back to clothes
      </Link>

      <div className="mt-4 rounded-[1.75rem] border border-[#e7c7bc] bg-white/85 p-6 shadow-[0_16px_50px_rgba(36,22,18,0.06)]">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          {image ? (
            <Image
              src={image}
              alt={item.name}
              width={120}
              height={120}
              unoptimized
              className="h-28 w-28 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-[#fff6f2] text-xs font-bold text-[#9a7e74]">
              No Image
            </div>
          )}

          <div>
            <h2 className="text-3xl font-black tracking-tight text-[#311812]">{item.name}</h2>
            <p className="mt-1 text-sm text-[#6f574f]">
              {item.category} • {item.color} • {item.size}
            </p>
          </div>

          <Link
            href={`/dashboard/admin/clothes/${item._id}/edit`}
            className="mt-2 inline-flex rounded-full bg-[#a43a24] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#8f3120] sm:ml-auto sm:mt-0"
          >
            Edit item
          </Link>
        </div>

        <div className="mb-6 rounded-[1.5rem] border border-[#f0d8d0] bg-[#fff8f5] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">
            Ecommerce price preview
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Subtotal</p>
              <p className="mt-1 text-lg font-black text-[#311812]">{formatMoney(priceSummary.subtotal)}</p>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Discount</p>
              <p className="mt-1 text-lg font-black text-[#311812]">-{formatMoney(priceSummary.discountAmount)}</p>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Tax</p>
              <p className="mt-1 text-lg font-black text-[#311812]">{formatMoney(priceSummary.taxAmount)}</p>
            </div>
            <div className="rounded-2xl bg-[#a43a24] px-4 py-3 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">Total</p>
              <p className="mt-1 text-lg font-black">{formatMoney(priceSummary.total)}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-[#6f574f]">
            Example calculation uses 10% discount for active items and 5% tax.
          </p>
        </div>

        <dl className="grid gap-px overflow-hidden rounded-[1.5rem] border border-[#f0d8d0] bg-[#f0d8d0] md:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 bg-white px-4 py-4">
              <dt className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">
                {label}
              </dt>
              <dd className="text-sm font-semibold text-[#311812]">{value || "—"}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
