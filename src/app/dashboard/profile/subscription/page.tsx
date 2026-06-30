import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserData } from "@/lib/cookies";
import { ROUTES } from "@/lib/routes";
import { Sparkles, Crown, CheckCircle2, ShoppingBag } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    icon: Sparkles,
    description: "Core styling, outfit suggestions, wardrobe storage, and basic shopping matches.",
    features: ["AI chat styling", "Outfit generation", "Wardrobe storage", "Limited image generation"],
  },
  {
    name: "Pro",
    price: "$12 / month",
    icon: Crown,
    description: "For heavier AI use, more image generations, and priority styling support.",
    features: ["Unlimited chatbot use", "More image generations", "Priority outfit ideas", "Advanced style assistance"],
    featured: true,
  },
];

export default async function SubscriptionPage() {
  const user = await getUserData();
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#FFF7F7] px-5 py-8 text-[#260909]">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A41515]">Subscription</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">Plans for AI styling</h1>
          </div>
          <Link href={ROUTES.profile} className="w-fit rounded-full border border-[#A41515] px-5 py-3 text-sm font-bold text-[#820000] transition hover:bg-[#A41515] hover:text-white">
            Back to profile
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 shadow-sm ${
                plan.featured ? "border-[#820000] bg-white" : "border-[#E7B8B8] bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF7F7]">
                    <plan.icon className="h-6 w-6 text-[#820000]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{plan.name}</h2>
                    <p className="text-sm text-[#735656]">{plan.description}</p>
                  </div>
                </div>
                <p className="text-right text-xl font-black text-[#820000]">{plan.price}</p>
              </div>

              <div className="mt-5 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm text-[#260909]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                    plan.featured ? "bg-[#820000] text-white hover:bg-[#5F0000]" : "border border-[#E7B8B8] bg-[#FFF7F7] text-[#820000] hover:bg-[#FFECEC]"
                  }`}
                >
                  {plan.featured ? "Upgrade to Pro" : "Current plan"}
                </button>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF7F7] px-4 py-3 text-sm font-semibold text-[#735656]">
                  <ShoppingBag className="h-4 w-4 text-[#820000]" />
                  Includes shop and outfit support
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
