import { handleGetRealUsers } from "@/lib/actions/admin/user-action";
import UserTable from "./_components/UserTable";
import { redirect } from "next/navigation";

type SearchParams = {
  page?: string | string[];
  limit?: string | string[];
  search?: string | string[];
  view?: string | string[];
};

function readValue(value: string | string[] | undefined, fallback: number) {
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  if (Array.isArray(value) && value[0]) {
    const parsed = Number(value[0]);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  return fallback;
}

function readString(value: string | string[] | undefined) {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return "";
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;
  const page = readValue(query.page, 1);
  const limit = readValue(query.limit, 10);
  const search = readString(query.search).trim();
  const includeAll = readString(query.view) === "all";

  const result = await handleGetRealUsers({ page, limit, search, includeAll });

  if (!result.success) {
    const msg = result.message?.toLowerCase() || "";
    if (msg.includes("unauthorized") || msg.includes("not found")) {
      redirect("/login?clear=true");
    }
    throw new Error(result.message || "Failed to load users");
  }

  if (!result.data || !result.pagination) {
    throw new Error(result.message || "Failed to load users");
  }

  return (
    <UserTable
      data={result.data}
      pagination={result.pagination}
      search={search}
      includeAll={includeAll}
      hiddenCount={result.hiddenCount ?? 0}
    />
  );
}
