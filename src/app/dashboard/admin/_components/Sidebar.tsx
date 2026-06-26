"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users } from "lucide-react";
import { ROUTES } from "@/lib/routes";

const NAV = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: ROUTES.adminUsers, label: "Users", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-[#e7c7bc] bg-white/80 backdrop-blur md:flex">
      <div className="flex h-16 items-center gap-3 border-b border-[#f0d8d0] px-6">
        <span className="h-5 w-1 rounded-full bg-[#a43a24]" />
        <span className="text-sm font-black uppercase tracking-[0.18em] text-[#311812]">
          Admin
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Admin sections">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-[#fff6f2] text-[#a43a24]"
                  : "text-[#6f574f] hover:bg-[#fffaf7] hover:text-[#311812]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#f0d8d0] p-4">
        <Link
          href={ROUTES.dashboard}
          className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6f574f] transition hover:text-[#311812]"
        >
          Back to dashboard
        </Link>
      </div>
    </aside>
  );
}
