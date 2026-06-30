import { handleGetAllOrders, handleGetOrderStats } from "@/lib/actions/admin/order-action";
import { AdminOrdersPanel } from "./_components/AdminOrdersPanel";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const [ordersResult, statsResult] = await Promise.all([
    handleGetAllOrders({ page: 1, limit: 15 }),
    handleGetOrderStats(),
  ]);

  return (
    <AdminOrdersPanel
      initialOrders={ordersResult.data ?? []}
      initialMeta={ordersResult.meta ?? { page: 1, limit: 15, total: 0, totalPages: 1 }}
      initialStats={statsResult.data ?? null}
    />
  );
}
