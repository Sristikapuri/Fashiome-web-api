import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserData } from "@/lib/cookies";
import { ROUTES } from "@/lib/routes";
import { Bell, Mail, Smartphone, ShoppingBag } from "lucide-react";

const notificationItems = [
  { title: "Order updates", description: "Get status changes for checkout and delivery.", icon: ShoppingBag },
  { title: "Style recommendations", description: "Receive outfit suggestions and seasonal looks.", icon: Bell },
  { title: "Email alerts", description: "Get important account and fashion updates by email.", icon: Mail },
  { title: "Push alerts", description: "Allow mobile notifications for quick reminders and AI prompts.", icon: Smartphone },
];

export default async function NotificationsPage() {
  const user = await getUserData();
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#FFF7F7] px-5 py-8 text-[#260909]">
      <section className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A41515]">Notifications</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">Alert preferences</h1>
          </div>
          <Link href={ROUTES.profile} className="w-fit rounded-full border border-[#A41515] px-5 py-3 text-sm font-bold text-[#820000] transition hover:bg-[#A41515] hover:text-white">
            Back to profile
          </Link>
        </div>

        <div className="space-y-4">
          {notificationItems.map((item) => (
            <div key={item.title} className="rounded-2xl border border-[#E7B8B8] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF7F7]">
                  <item.icon className="h-5 w-5 text-[#820000]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-[#260909]">{item.title}</h2>
                  <p className="mt-1 text-sm text-[#735656]">{item.description}</p>
                </div>
                <label className="inline-flex items-center">
                  <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-[#E7B8B8] text-[#820000] focus:ring-[#820000]" />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
