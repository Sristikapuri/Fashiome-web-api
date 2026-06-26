"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { handleLogoutUser } from "@/lib/actions/auth-action";
import { ROUTES } from "@/lib/routes";

type AdminShellUser = {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  role?: string;
};

const TITLES: Record<string, string> = {
  admin: "Overview",
  users: "Users",
  create: "Create user",
  edit: "Edit user",
};

export default function Header({ user }: { user: AdminShellUser }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] ?? "admin";
  const title = TITLES[lastSegment] ?? lastSegment;

  return (
    <header className="border-b border-[#e7c7bc] bg-white/75 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9a7e74]">
            {segments.join(" / ") || "dashboard / admin"}
          </p>
          <h1 className="text-2xl font-black tracking-tight text-[#311812]">{title}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/admin"
            className="rounded-full border border-[#e7c7bc] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6f574f] transition hover:bg-[#fff6f2] hover:text-[#311812] md:hidden"
          >
            Overview
          </Link>
          <Link
            href={ROUTES.adminUsers}
            className="rounded-full border border-[#e7c7bc] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6f574f] transition hover:bg-[#fff6f2] hover:text-[#311812] md:hidden"
          >
            Users
          </Link>
          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold text-[#311812]">
              {user.username || user.email || "Admin"}
            </p>
            <p className="text-xs text-[#9a7e74]">{user.role || "admin"}</p>
          </div>
          <form action={handleLogoutUser}>
            <button
              type="submit"
              className="rounded-full bg-[#a43a24] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#8f3120]"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
