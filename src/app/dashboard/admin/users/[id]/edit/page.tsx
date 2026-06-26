import Link from "next/link";
import { notFound } from "next/navigation";
import { handleGetUserById } from "@/lib/actions/admin/user-action";
import UserFormEdit from "../../_components/UserFormEdit";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await handleGetUserById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-7xl">
      <Link
        href={`/dashboard/admin/users/${id}`}
        className="text-xs font-bold uppercase tracking-[0.18em] text-[#6f574f] transition hover:text-[#311812]"
      >
        ← Back to user
      </Link>
      <h2 className="mt-4 text-3xl font-black tracking-tight text-[#311812]">
        Edit user
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f574f]">
        Update the selected user in a form that matches your project data
        model.
      </p>
      <div className="mt-8 rounded-[1.75rem] border border-[#e7c7bc] bg-white/85 p-6 shadow-[0_16px_50px_rgba(36,22,18,0.06)]">
        <UserFormEdit user={result.data} />
      </div>
    </section>
  );
}
