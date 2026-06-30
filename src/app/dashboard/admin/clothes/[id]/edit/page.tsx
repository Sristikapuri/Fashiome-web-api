import Link from "next/link";
import { notFound } from "next/navigation";
import { handleGetClotheById } from "@/lib/actions/admin/clothes-action";
import ClotheForm from "../../_components/ClotheForm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await handleGetClotheById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-7xl">
      <Link
        href={`/dashboard/admin/clothes/${id}`}
        className="text-xs font-bold uppercase tracking-[0.18em] text-[#6f574f] transition hover:text-[#311812]"
      >
        ← Back to item
      </Link>
      <h2 className="mt-4 text-3xl font-black tracking-tight text-[#311812]">
        Edit clothes item
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f574f]">
        Update the selected clothing item in your fashion catalog.
      </p>
      <div className="mt-8 rounded-[1.75rem] border border-[#e7c7bc] bg-white/85 p-6 shadow-[0_16px_50px_rgba(36,22,18,0.06)]">
        <ClotheForm item={result.data} />
      </div>
    </section>
  );
}
