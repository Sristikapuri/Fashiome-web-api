import Link from "next/link";
import StatusScreen from "./_components/StatusScreen";
import { ROUTES } from "@/lib/routes";

export default function NotFound() {
  return (
    <StatusScreen
      code="404"
      title="Page not found"
      description="The admin page you’re looking for doesn’t exist or may have moved."
    >
      <Link
        href={ROUTES.admin}
        className="rounded-full bg-[#a43a24] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#8f3120]"
      >
        Back to admin
      </Link>
    </StatusScreen>
  );
}
