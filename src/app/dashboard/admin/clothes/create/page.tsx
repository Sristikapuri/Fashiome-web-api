import Link from "next/link";
import ClotheForm from "../_components/ClotheForm";

export default function Page() {
  return (
    <section className="mx-auto w-full max-w-7xl">
      <Link
        href="/dashboard/admin/clothes"
        className="text-xs font-bold uppercase tracking-[0.18em] text-[#6f574f] transition hover:text-[#311812]"
      >
        ← Back to clothes
      </Link>
      <h2 className="mt-4 text-3xl font-black tracking-tight text-[#311812]">
        Create clothes item
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f574f]">
        Add a new clothing item to your admin catalog so your website can grow beyond user management.
      </p>
      <div className="mt-8 rounded-[1.75rem] border border-[#e7c7bc] bg-white/85 p-6 shadow-[0_16px_50px_rgba(36,22,18,0.06)]">
        <ClotheForm />
      </div>
    </section>
  );
}
