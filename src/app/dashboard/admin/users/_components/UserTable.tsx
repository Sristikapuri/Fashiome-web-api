"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Copy, Edit3, Eye, Search, Trash2 } from "lucide-react";
import { handleDeleteUser } from "@/lib/actions/admin/user-action";
import Modal from "../../_components/Modal";
import type { AdminUser, PaginationMeta } from "@/lib/api/admin/user";

export default function UserTable({
  data,
  pagination,
  search,
  includeAll,
  hiddenCount,
}: {
  data: AdminUser[];
  pagination: PaginationMeta;
  search: string;
  includeAll: boolean;
  hiddenCount: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [target, setTarget] = useState<AdminUser | null>(null);
  const [error, setError] = useState("");

  const page = pagination?.page ?? 1;
  const limit = pagination?.limit ?? 10;
  const totalPages = Math.max(pagination?.totalPages ?? 1, 1);
  const total = pagination?.total ?? 0;

  const setQuery = (next: Record<string, string | number>) => {
    const query = new URLSearchParams(params.toString());

    Object.entries(next).forEach(([key, value]) => {
      query.set(key, String(value));
    });

    router.push(`/dashboard/admin/users?${query.toString()}`);
  };

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("search") as string;
    setQuery({ search: value ?? "", page: 1 });
  };

  const onDelete = () => {
    if (!target) return;

    setError("");
    startTransition(async () => {
      const result = await handleDeleteUser(target._id);

      if (result.success) {
        setTarget(null);
        router.refresh();
        return;
      }

      setError(result.message || "Failed to delete user");
    });
  };

  const activeClass = "inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-[0.16em]";

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Admin panel</p>
          <h2 className="mt-1 text-3xl font-black tracking-tight text-[#311812]">User Management</h2>
          <p className="mt-2 text-sm text-[#6f574f]">
            {total} {includeAll ? "total users" : "real users"}
            {!includeAll && hiddenCount > 0 ? (
              <>
                {" "}
                &middot;{" "}
                <button
                  type="button"
                  onClick={() => setQuery({ view: "all", page: 1 })}
                  className="font-bold text-[#a43a24] underline-offset-2 hover:underline"
                >
                  show {hiddenCount} hidden test/duplicate account{hiddenCount === 1 ? "" : "s"}
                </button>
              </>
            ) : null}
            {includeAll ? (
              <>
                {" "}
                &middot;{" "}
                <button
                  type="button"
                  onClick={() => setQuery({ view: "real", page: 1 })}
                  className="font-bold text-[#a43a24] underline-offset-2 hover:underline"
                >
                  hide test/duplicate accounts
                </button>
              </>
            ) : null}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/dashboard/admin/users/duplicates"
            className="inline-flex items-center gap-2 rounded-full border border-[#e7c7bc] bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#6f574f] transition hover:border-[#a43a24] hover:text-[#a43a24]"
          >
            <Copy className="h-4 w-4" />
            Find duplicates
          </Link>
          <Link
            href="/dashboard/admin/users/create"
            className="rounded-full bg-[#a43a24] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#8f3120]"
          >
            Create user
          </Link>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 rounded-[1.75rem] border border-[#e7c7bc] bg-white/85 p-4 shadow-[0_16px_50px_rgba(36,22,18,0.06)] lg:flex-row lg:items-center lg:justify-between">
        <form onSubmit={onSearch} className="flex w-full gap-2 lg:max-w-md">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a7e74]" />
            <input
              name="search"
              defaultValue={search}
              placeholder="Search by name, email, or username"
              className="h-12 w-full rounded-2xl border border-[#e7c7bc] bg-[#fffaf7] pl-11 pr-4 text-sm text-[#260909] outline-none transition focus:border-[#a43a24]"
            />
          </div>
          <button className="h-12 rounded-2xl border border-[#e7c7bc] bg-[#241612] px-4 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#3b241b]">
            Search
          </button>
        </form>

        <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#6f574f]">
          Rows
          <select
            value={limit}
            onChange={(event) => setQuery({ limit: event.target.value, page: 1 })}
            className="h-12 rounded-2xl border border-[#e7c7bc] bg-[#fffaf7] px-3 text-sm text-[#260909] outline-none transition focus:border-[#a43a24]"
          >
            {[5, 10, 20, 50].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-x-auto rounded-[1.75rem] border border-[#e7c7bc] bg-white shadow-[0_16px_50px_rgba(36,22,18,0.06)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#f0d8d0] bg-[#fff6f2] text-xs uppercase tracking-[0.18em] text-[#8f3927]">
            <tr>
              <th className="px-5 py-4 font-bold">ID</th>
              <th className="px-5 py-4 font-bold">Name</th>
              <th className="px-5 py-4 font-bold">Email</th>
              <th className="px-5 py-4 font-bold">Role</th>
              <th className="px-5 py-4 font-bold">Status</th>
              <th className="px-5 py-4 font-bold">Created</th>
              <th className="px-5 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3e4dd]">
            {data.length ? (
              data.map((user) => (
                <tr key={user._id} className="hover:bg-[#fffaf7]">
                  <td className="px-5 py-4 font-mono text-xs text-[#735656]">
                    <div className="max-w-[160px] truncate">{user._id}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-[#311812]">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-[#735656]">@{user.username}</div>
                  </td>
                  <td className="px-5 py-4 text-[#6f574f]">{user.email}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`${activeClass} ${
                        user.role === "admin"
                          ? "bg-[#fff6f2] text-[#a43a24]"
                          : "bg-[#f4ede8] text-[#6f574f]"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`${activeClass} ${
                        (user.status || "active") === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {user.status || "active"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#6f574f]">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/admin/users/${user._id}`}
                        className="rounded-full border border-[#e7c7bc] bg-white p-2 text-[#6f574f] transition hover:border-[#a43a24] hover:text-[#a43a24]"
                        aria-label={`View ${user.firstName} ${user.lastName}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/dashboard/admin/users/${user._id}/edit`}
                        className="rounded-full border border-[#e7c7bc] bg-white p-2 text-[#6f574f] transition hover:border-[#a43a24] hover:text-[#a43a24]"
                        aria-label={`Edit ${user.firstName} ${user.lastName}`}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setError("");
                          setTarget(user);
                        }}
                        className="rounded-full border border-[#f2c6bc] bg-white p-2 text-[#8f3927] transition hover:border-[#d24d35] hover:text-[#d24d35]"
                        aria-label={`Delete ${user.firstName} ${user.lastName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#6f574f]">
                  No users found for the current search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#6f574f]">
          Showing {total === 0 ? 0 : (page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setQuery({ page: page - 1 })}
            className="inline-flex h-10 items-center gap-1 rounded-full border border-[#e7c7bc] bg-white px-4 text-xs font-bold uppercase tracking-[0.18em] text-[#6f574f] transition hover:bg-[#fff6f2] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          <span className="rounded-full bg-[#fff6f2] px-4 py-2 text-sm font-bold text-[#311812]">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setQuery({ page: page + 1 })}
            className="inline-flex h-10 items-center gap-1 rounded-full border border-[#e7c7bc] bg-white px-4 text-xs font-bold uppercase tracking-[0.18em] text-[#6f574f] transition hover:bg-[#fff6f2] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Modal
        open={!!target}
        onClose={() => {
          setTarget(null);
          setError("");
        }}
        title="Delete user"
      >
        <p className="mb-6 text-sm leading-6 text-[#6f574f]">
          Delete{" "}
          <span className="font-semibold text-[#311812]">
            {target?.firstName} {target?.lastName}
          </span>
          ? This action cannot be undone.
        </p>
        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setTarget(null);
              setError("");
            }}
            className="rounded-full border border-[#e7c7bc] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#6f574f] transition hover:bg-[#fff6f2]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isPending}
            className="rounded-full bg-[#d94d36] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#bf3f2a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
