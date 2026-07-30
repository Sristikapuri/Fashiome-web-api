"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { handleBulkDeleteUsers } from "@/lib/actions/admin/user-action";
import Modal from "../../../_components/Modal";
import type { AdminUser } from "@/lib/api/admin/user";
import type { DuplicateUserGroup } from "@/lib/actions/admin/user-action";

function useSelection(ids: string[]) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(ids));

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return { selected, toggle };
}

export default function DuplicatesPanel({
  groups,
  fixtureUsers,
}: {
  groups: DuplicateUserGroup[];
  fixtureUsers: AdminUser[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [confirmTarget, setConfirmTarget] = useState<"duplicates" | "fixtures" | null>(null);

  const duplicateIds = useMemo(
    () => groups.flatMap((group) => group.duplicates.map((user) => user._id)),
    [groups]
  );
  const fixtureIds = useMemo(() => fixtureUsers.map((user) => user._id), [fixtureUsers]);

  const duplicateSelection = useSelection(duplicateIds);
  const fixtureSelection = useSelection(fixtureIds);

  const runDelete = (ids: string[]) => {
    setError("");
    startTransition(async () => {
      const result = await handleBulkDeleteUsers(ids);

      if (!result.success) {
        setError(
          `Deleted ${result.deletedCount} of ${ids.length}. ${result.failedIds.length} could not be removed.`
        );
      }

      setConfirmTarget(null);
      router.refresh();
    });
  };

  const hasDuplicates = groups.length > 0;
  const hasFixtures = fixtureUsers.length > 0;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-6">
        <Link
          href="/dashboard/admin/users"
          className="mb-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74] hover:text-[#a43a24]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to users
        </Link>
        <h2 className="text-3xl font-black tracking-tight text-[#311812]">Duplicate Users</h2>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="mb-10">
        <div className="mb-4 flex flex-col items-start justify-between gap-3 lg:flex-row lg:items-center">
          <div>
            <h3 className="text-lg font-black text-[#311812]">Duplicate accounts</h3>
            <p className="mt-1 text-sm text-[#6f574f]">
              {hasDuplicates
                ? `${groups.length} duplicate group${groups.length === 1 ? "" : "s"} found, grouped by matching email or username. The oldest account in each group is kept.`
                : "No duplicate accounts found."}
            </p>
          </div>

          {hasDuplicates ? (
            <button
              type="button"
              disabled={duplicateSelection.selected.size === 0 || isPending}
              onClick={() => setConfirmTarget("duplicates")}
              className="inline-flex items-center gap-2 rounded-full bg-[#a43a24] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#8f3120] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Remove {duplicateSelection.selected.size} selected
            </button>
          ) : null}
        </div>

        {hasDuplicates ? (
          <div className="flex flex-col gap-5">
            {groups.map((group) => (
              <div
                key={group.key}
                className="overflow-x-auto rounded-[1.75rem] border border-[#e7c7bc] bg-white shadow-[0_16px_50px_rgba(36,22,18,0.06)]"
              >
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-[#f0d8d0] bg-[#fff6f2] text-xs uppercase tracking-[0.18em] text-[#8f3927]">
                    <tr>
                      <th className="px-5 py-3 font-bold">Keep</th>
                      <th className="px-5 py-3 font-bold">Name</th>
                      <th className="px-5 py-3 font-bold">Email</th>
                      <th className="px-5 py-3 font-bold">Username</th>
                      <th className="px-5 py-3 font-bold">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3e4dd]">
                    <tr className="bg-emerald-50/60">
                      <td className="px-5 py-3">
                        <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                          Kept
                        </span>
                      </td>
                      <td className="px-5 py-3 font-semibold text-[#311812]">
                        {group.keep.firstName} {group.keep.lastName}
                      </td>
                      <td className="px-5 py-3 text-[#6f574f]">{group.keep.email}</td>
                      <td className="px-5 py-3 text-[#6f574f]">@{group.keep.username}</td>
                      <td className="px-5 py-3 text-[#6f574f]">
                        {group.keep.createdAt ? new Date(group.keep.createdAt).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                    {group.duplicates.map((user) => (
                      <tr key={user._id} className="hover:bg-[#fffaf7]">
                        <td className="px-5 py-3">
                          <input
                            type="checkbox"
                            checked={duplicateSelection.selected.has(user._id)}
                            onChange={() => duplicateSelection.toggle(user._id)}
                            className="h-4 w-4 accent-[#a43a24]"
                            aria-label={`Select ${user.firstName} ${user.lastName} for removal`}
                          />
                        </td>
                        <td className="px-5 py-3 text-[#311812]">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="px-5 py-3 text-[#6f574f]">{user.email}</td>
                        <td className="px-5 py-3 text-[#6f574f]">@{user.username}</td>
                        <td className="px-5 py-3 text-[#6f574f]">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section>
        <div className="mb-4 flex flex-col items-start justify-between gap-3 lg:flex-row lg:items-center">
          <div>
            <h3 className="text-lg font-black text-[#311812]">Test / placeholder accounts</h3>
            <p className="mt-1 text-sm text-[#6f574f]">
              {hasFixtures
                ? `${fixtureUsers.length} account${fixtureUsers.length === 1 ? "" : "s"} on a test domain (@fashiome-e2e.test from the Playwright suite, or @example.com from dev/QA scripts).`
                : "No leftover test/placeholder accounts found."}
            </p>
          </div>

          {hasFixtures ? (
            <button
              type="button"
              disabled={fixtureSelection.selected.size === 0 || isPending}
              onClick={() => setConfirmTarget("fixtures")}
              className="inline-flex items-center gap-2 rounded-full bg-[#a43a24] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#8f3120] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Remove {fixtureSelection.selected.size} selected
            </button>
          ) : null}
        </div>

        {hasFixtures ? (
          <div className="overflow-x-auto rounded-[1.75rem] border border-[#e7c7bc] bg-white shadow-[0_16px_50px_rgba(36,22,18,0.06)]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#f0d8d0] bg-[#fff6f2] text-xs uppercase tracking-[0.18em] text-[#8f3927]">
                <tr>
                  <th className="px-5 py-3 font-bold"></th>
                  <th className="px-5 py-3 font-bold">Name</th>
                  <th className="px-5 py-3 font-bold">Email</th>
                  <th className="px-5 py-3 font-bold">Username</th>
                  <th className="px-5 py-3 font-bold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3e4dd]">
                {fixtureUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-[#fffaf7]">
                    <td className="px-5 py-3">
                      <input
                        type="checkbox"
                        checked={fixtureSelection.selected.has(user._id)}
                        onChange={() => fixtureSelection.toggle(user._id)}
                        className="h-4 w-4 accent-[#a43a24]"
                        aria-label={`Select ${user.firstName} ${user.lastName} for removal`}
                      />
                    </td>
                    <td className="px-5 py-3 text-[#311812]">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-5 py-3 text-[#6f574f]">{user.email}</td>
                    <td className="px-5 py-3 text-[#6f574f]">@{user.username}</td>
                    <td className="px-5 py-3 text-[#6f574f]">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <Modal
        open={confirmTarget !== null}
        onClose={() => setConfirmTarget(null)}
        title={confirmTarget === "fixtures" ? "Remove test fixture accounts" : "Remove duplicate users"}
      >
        <p className="mb-6 text-sm leading-6 text-[#6f574f]">
          This will permanently delete{" "}
          <span className="font-semibold text-[#311812]">
            {confirmTarget === "fixtures" ? fixtureSelection.selected.size : duplicateSelection.selected.size}
          </span>{" "}
          account{(confirmTarget === "fixtures" ? fixtureSelection.selected.size : duplicateSelection.selected.size) === 1 ? "" : "s"}. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setConfirmTarget(null)}
            className="rounded-full border border-[#e7c7bc] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#6f574f] transition hover:bg-[#fff6f2]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() =>
              runDelete(
                Array.from(confirmTarget === "fixtures" ? fixtureSelection.selected : duplicateSelection.selected)
              )
            }
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
