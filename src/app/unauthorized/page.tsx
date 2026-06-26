import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF7F7] px-6 text-[#260909]">
      <section className="max-w-md rounded-[1.75rem] border border-[#e7b8b8] bg-white p-8 text-center shadow-[0_16px_50px_rgba(74,29,29,0.08)]">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A41515]">
          Access denied
        </p>
        <h1 className="mt-3 text-3xl font-black text-[#311812]">Unauthorized</h1>
        <p className="mt-3 text-sm leading-6 text-[#735656]">
          You do not have permission to access this page.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-full bg-[#820000] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5F0000]"
        >
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
