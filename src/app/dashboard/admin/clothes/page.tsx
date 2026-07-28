import { redirect } from "next/navigation";
import { handleGetAllClothes } from "@/lib/actions/admin/clothes-action";
import ClotheTable from "./_components/ClotheTable";

type SearchParams = {
  page?: string | string[];
  limit?: string | string[];
  search?: string | string[];
  category?: string | string[];
  status?: string | string[];
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
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] ?? "";
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
  const category = readString(query.category).trim();
  const status = readString(query.status).trim();

  const result = await handleGetAllClothes({ page, limit, search, category, status });

  if (!result.success) {
    const msg = result.message?.toLowerCase() || "";
    if (msg.includes("unauthorized") || msg.includes("not found")) {
      redirect("/login?clear=true");
    }
    throw new Error(result.message || "Failed to load clothes");
  }

  if (!result.data || !result.pagination) {
    throw new Error(result.message || "Failed to load clothes");
  }

  return <ClotheTable data={result.data} pagination={result.pagination} search={search} category={category} status={status} />;
}
