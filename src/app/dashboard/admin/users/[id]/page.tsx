import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api/base-url";
import { handleGetUserById } from "@/lib/actions/admin/user-action";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await handleGetUserById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const user = result.data;

  const rows: [string, string][] = [
    ["First name", user.firstName],
    ["Last name", user.lastName],
    ["Email", user.email],
    ["Username", user.username],
    ["Gender", user.gender],
    ["Age", String(user.age)],
    ["Role", user.role],
    ["Status", user.status || "active"],
    ["Created", user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"],
    ["Updated", user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "—"],
  ];

  return (
    <section className="mx-auto w-full max-w-4xl">
      <Link
        href="/dashboard/admin/users"
        className="text-xs font-bold uppercase tracking-[0.18em] text-[#6f574f] transition hover:text-[#311812]"
      >
        ← Back to users
      </Link>

      <div className="mt-4 rounded-[1.75rem] border border-[#e7c7bc] bg-white/85 p-6 shadow-[0_16px_50px_rgba(36,22,18,0.06)]">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          {user.profileImage ? (
            <Image
              src={user.profileImage.startsWith("http") ? user.profileImage : `${getApiBaseUrl()}${user.profileImage}`}
              alt={`${user.firstName} ${user.lastName}`}
              width={80}
              height={80}
              unoptimized
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fff6f2] text-xs font-bold text-[#9a7e74]">
              No Image
            </div>
          )}

          <div>
            <h2 className="text-3xl font-black tracking-tight text-[#311812]">
              {user.firstName} {user.lastName}
            </h2>
            <p className="mt-1 text-sm text-[#6f574f]">{user.email}</p>
          </div>

          <Link
            href={`/dashboard/admin/users/${user._id}/edit`}
            className="mt-2 inline-flex rounded-full bg-[#a43a24] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#8f3120] sm:ml-auto sm:mt-0"
          >
            Edit User
          </Link>
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
