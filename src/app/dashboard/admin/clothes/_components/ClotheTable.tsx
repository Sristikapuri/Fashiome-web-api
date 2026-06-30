"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Edit3, Eye, Search, Trash2 } from "lucide-react";
import Modal from "../../_components/Modal";
import { handleDeleteClothe } from "@/lib/actions/admin/clothes-action";
import type { AdminClothe, PaginationMeta } from "@/lib/api/admin/clothes";

export default function ClotheTable({
  data,
  pagination,
  search,
  category,
  status,
}: {
  data: AdminClothe[];
  pagination: PaginationMeta;
  search: string;
  category: string;
  status: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [target, setTarget] = useState<AdminClothe | null>(null);
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
    router.push(`/dashboard/admin/clothes?${query.toString()}`);
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
      const result = await handleDeleteClothe(target._id);
      if (result.success) {
        setTarget(null);
        router.refresh();
        return;
      }
      setError(result.message || "Failed to delete clothes item");
    });
  };

  const activeClass = "inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-[0.16em]";

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Catalog</p>
          <h2 className="mt-1 text-3xl font-black tracking-tight text-[#311812]">Clothes management</h2>
          <p className="mt-2 text-sm text-[#6f574f]">{total} total items</p>
        </div>

        <Link
          href="/dashboard/admin/clothes/create"
          className="rounded-full bg-[#a43a24] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#8f3120]"
        >
          New item
        </Link>
      </div>

      <div className="mb-4 flex flex-col gap-3 rounded-[1.75rem] border border-[#e7c7bc] bg-white/85 p-4 shadow-[0_16px_50px_rgba(36,22,18,0.06)] lg:flex-row lg:items-center lg:justify-between">
        <form onSubmit={onSearch} className="flex w-full gap-2 lg:max-w-md">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a7e74]" />
            <input
              name="search"
              defaultValue={search}
              placeholder="Search clothes by name, color, category..."
              className="h-12 w-full rounded-2xl border border-[#e7c7bc] bg-[#fffaf7] pl-11 pr-4 text-sm text-[#260909] outline-none transition focus:border-[#a43a24]"
            />
          </div>
          <button className="h-12 rounded-2xl border border-[#e7c7bc] bg-[#241612] px-4 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#3b241b]">
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#6f574f]">
            Category
            <select
              value={category}
              onChange={(event) => setQuery({ category: event.target.value, page: 1 })}
              className="h-12 rounded-2xl border border-[#e7c7bc] bg-[#fffaf7] px-3 text-sm text-[#260909] outline-none transition focus:border-[#a43a24]"
            >
              <option value="">All</option>
              <option value="tops">Tops</option>
              <option value="bottoms">Bottoms</option>
              <option value="shoes">Shoes</option>
              <option value="accessories">Accessories</option>
              <option value="dresses">Dresses</option>
              <option value="outerwear">Outerwear</option>
              <option value="shirts">Shirts</option>
              <option value="sweaters">Sweaters</option>
              <option value="pants">Pants</option>
              <option value="skirts">Skirts</option>
              <option value="activewear">Activewear</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#6f574f]">
            Status
            <select
              value={status}
              onChange={(event) => setQuery({ status: event.target.value, page: 1 })}
              className="h-12 rounded-2xl border border-[#e7c7bc] bg-[#fffaf7] px-3 text-sm text-[#260909] outline-none transition focus:border-[#a43a24]"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

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
      </div>

      <div className="overflow-x-auto rounded-[1.75rem] border border-[#e7c7bc] bg-white shadow-[0_16px_50px_rgba(36,22,18,0.06)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#f0d8d0] bg-[#fff6f2] text-xs uppercase tracking-[0.18em] text-[#8f3927]">
            <tr>
              <th className="px-5 py-4 font-bold">Name</th>
              <th className="px-5 py-4 font-bold">Category</th>
              <th className="px-5 py-4 font-bold">Size</th>
              <th className="px-5 py-4 font-bold">Color</th>
              <th className="px-5 py-4 font-bold">Price</th>
              <th className="px-5 py-4 font-bold">Stock</th>
              <th className="px-5 py-4 font-bold">Status</th>
              <th className="px-5 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3e4dd]">
            {data.length ? (
              data.map((item) => (
                <tr key={item._id} className="hover:bg-[#fffaf7]">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-[#311812]">{item.name}</div>
                    <div className="text-xs text-[#735656] max-w-[240px] truncate">{item.description || "No description"}</div>
                  </td>
                  <td className="px-5 py-4 text-[#6f574f]">{item.category}</td>
                  <td className="px-5 py-4 text-[#6f574f]">{item.size}</td>
                  <td className="px-5 py-4 text-[#6f574f]">{item.color}</td>
                  <td className="px-5 py-4 text-[#6f574f]">${Number(item.price).toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`${activeClass} ${
                        item.stock === 0
                          ? "bg-red-100 text-red-700"
                          : item.stock < 10
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {item.stock} {item.stock === 0 ? "(Out of stock)" : item.stock < 10 ? "(Low stock)" : ""}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`${activeClass} ${
                        (item.status || "active") === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {item.status || "active"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/admin/clothes/${item._id}`}
                        className="rounded-full border border-[#e7c7bc] bg-white p-2 text-[#6f574f] transition hover:border-[#a43a24] hover:text-[#a43a24]"
                        aria-label={`View ${item.name}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/dashboard/admin/clothes/${item._id}/edit`}
                        className="rounded-full border border-[#e7c7bc] bg-white p-2 text-[#6f574f] transition hover:border-[#a43a24] hover:text-[#a43a24]"
                        aria-label={`Edit ${item.name}`}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setError("");
                          setTarget(item);
                        }}
                        className="rounded-full border border-[#f2c6bc] bg-white p-2 text-[#8f3927] transition hover:border-[#d24d35] hover:text-[#d24d35]"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-sm text-[#6f574f]">
                  No clothes found.
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
        title="Delete clothes item"
      >
        <p className="mb-6 text-sm leading-6 text-[#6f574f]">
          Delete{" "}
          <span className="font-semibold text-[#311812]">{target?.name}</span>? This cannot be undone.
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
