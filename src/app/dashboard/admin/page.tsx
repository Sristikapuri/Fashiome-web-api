import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { ROUTES } from "@/lib/routes";

const CARDS = [
  {
    href: ROUTES.adminUsers,
    label: "Users",
    desc: "Search, create, update, and delete user accounts.",
    icon: Users,
  },
];

export default function AdminHomePage() {
  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">
          Admin
        </p>
        <h2 className="mt-2 text-4xl font-black tracking-tight text-[#311812]">
          Overview
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f574f]">
          Manage the platform from one place. The users section is wired to the
          Sprint 4 CRUD flow and paginated admin API.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {CARDS.map(({ href, label, desc, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-[1.75rem] border border-[#e7c7bc] bg-white/85 p-6 shadow-[0_16px_50px_rgba(36,22,18,0.06)] transition hover:-translate-y-0.5 hover:border-[#a43a24]"
          >
            <div className="mb-4 inline-flex rounded-2xl bg-[#fff6f2] p-3 text-[#a43a24]">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-black text-[#311812]">{label}</h3>
            <p className="mt-2 text-sm leading-6 text-[#6f574f]">{desc}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#a43a24]">
              Manage
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
