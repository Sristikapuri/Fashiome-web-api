import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserData } from "@/lib/cookies";
import { ROUTES } from "@/lib/routes";
import { Lock, CheckCircle2 } from "lucide-react";

export default async function SecurityPage() {
  const user = await getUserData();
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#FFF7F7] px-5 py-8 text-[#260909]">
      <section className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A41515]">Privacy & Security</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">Security settings</h1>
          </div>
          <Link href={ROUTES.profile} className="w-fit rounded-full border border-[#A41515] px-5 py-3 text-sm font-bold text-[#820000] transition hover:bg-[#A41515] hover:text-white">
            Back to profile
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            { icon: Lock, title: "Change password", text: "Update your login password from the dedicated password page.", href: ROUTES.password },
            { icon: CheckCircle2, title: "Security status", text: "Your account is currently protected with standard login security." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-[#E7B8B8] bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF7F7]">
                  <item.icon className="h-5 w-5 text-[#820000]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-[#260909]">{item.title}</h2>
                  <p className="mt-1 text-sm text-[#735656]">{item.text}</p>
                  {item.href ? (
                    <Link href={item.href} className="mt-3 inline-flex text-sm font-bold text-[#820000]">
                      Open settings
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
