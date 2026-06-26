"use client";

import { useEffect } from "react";
import StatusScreen from "./_components/StatusScreen";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      code="500"
      title="Something went wrong"
      description={error.message || "An unexpected error occurred while loading this section."}
    >
      <button
        onClick={reset}
        className="rounded-full bg-[#a43a24] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#8f3120]"
      >
        Try again
      </button>
    </StatusScreen>
  );
}
