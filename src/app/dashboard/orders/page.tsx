"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertTriangle, LoaderCircle } from "lucide-react";
import { handleVerifyEsewaPayment } from "@/lib/actions/esewa-action";
import { ROUTES } from "@/lib/routes";
import MyOrdersTab from "../_components/MyOrdersTab";

function OrdersPageContent() {
  const searchParams = useSearchParams();
  const [verificationState, setVerificationState] = useState<"idle" | "loading" | "done">("idle");
  const [banner, setBanner] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  const paymentStatus = searchParams.get("payment");
  const orderId =
    searchParams.get("orderId") ||
    searchParams.get("oid") ||
    searchParams.get("pid");
  const refId =
    searchParams.get("refId") ||
    searchParams.get("ref_id") ||
    searchParams.get("rid");
  const data = searchParams.get("data");
  const amount = useMemo(() => {
    const raw =
      searchParams.get("amount") ||
      searchParams.get("amt") ||
      searchParams.get("total_amount") ||
      searchParams.get("tAmt");
    return raw ? Number(raw) : NaN;
  }, [searchParams]);

  useEffect(() => {
    if (paymentStatus === "failed") {
      // Payment return parameters are an external synchronization boundary.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBanner({
        tone: "error",
        message: orderId
          ? `eSewa payment was not completed for order ${orderId.slice(-8)}. You can try again from checkout.`
          : "eSewa payment was not completed. You can try again from checkout.",
      });
      return;
    }

    if (paymentStatus !== "success") {
      return;
    }

    if (!orderId) {
      setBanner({
        tone: "error",
        message: "Payment returned without an order reference. Please check your latest order status.",
      });
      return;
    }

    if (!data) {
      setBanner({
        tone: "success",
        message: `Payment returned successfully for order ${orderId.slice(-8)}. Refresh in a moment if the status is still pending.`,
      });
      return;
    }

    if (verificationState !== "idle") {
      return;
    }

    setVerificationState("loading");

    void handleVerifyEsewaPayment({ amount, orderId, refId: refId || "", data: data || undefined }).then((result) => {
      if (result.success) {
        setBanner({
          tone: "success",
          message: `eSewa payment verified for order ${orderId.slice(-8)}. Your order is now marked as paid.`,
        });
      } else {
        setBanner({
          tone: "error",
          message: result.message || "We could not verify the eSewa payment yet. Please try refreshing the page.",
        });
      }
      setVerificationState("done");
    });
  }, [amount, data, orderId, paymentStatus, refId, verificationState]);

  return (
    <div className="min-h-screen bg-[#FFF7F7] px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#260909]">My Orders</h1>
            <p className="mt-1 text-sm text-[#735656]">
              Review your purchase history and payment status.
            </p>
          </div>
          <Link
            href={`${ROUTES.dashboard}?tab=shop`}
            className="rounded-full border border-[#E7B8B8] bg-white px-5 py-2.5 text-sm font-bold text-[#820000] no-underline transition hover:bg-[#FFF7F7]"
          >
            Back to shop
          </Link>
        </div>

        {verificationState === "loading" && (
          <div className="flex items-center gap-3 rounded-2xl border border-[#D8E6F7] bg-[#F6FAFF] px-4 py-3 text-sm text-[#245A91]">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Verifying your eSewa payment...
          </div>
        )}

        {banner && (
          <div
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
              banner.tone === "success"
                ? "border-[#B7DFC2] bg-[#F4FFF6] text-[#23613A]"
                : "border-[#E7B8B8] bg-[#FFF7F7] text-[#8B3030]"
            }`}
          >
            {banner.tone === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>{banner.message}</span>
          </div>
        )}

        <MyOrdersTab />
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF7F7]" />}>
      <OrdersPageContent />
    </Suspense>
  );
}
