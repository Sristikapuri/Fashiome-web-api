import { getUserData } from "@/lib/cookies";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Crown, Sparkles, Heart, Calendar, TrendingUp, Quote } from "lucide-react";

const editorialPicks = [
  {
    id: 1,
    title: " summer Dress",
    category: "Summer",
    image: "/images/welcome/hero-gown.jpg",
    
  },
  {
    id: 2,
    title: " Blazer Set",
    category: "winter",
    image: "/images/welcome/hero-editorial.jpg",

  },
  {
    id: 3,
    title: "Jacket",
    category: "Casual",
    image: "/images/welcome/hero-blazer.jpg",

  }
];

const occasions = [
  { name: "Wedding", icon: "💍" },
  { name: "Party", icon: "🎉" },
  { name: "Office", icon: "💼" },
  { name: "Casual", icon: "🌟" },
  { name: "Festival", icon: "🎊" },
  { name: "Date Night", icon: "❤️" }
];

const weeklyArchive = [
  { day: "Mon", outfit: "Monochrome Chic" },
  { day: "Tue", outfit: "Floral Fusion" },
  { day: "Wed", outfit: "Elegant Minimal" },
  { day: "Thu", outfit: "Bold Statement" },
  { day: "Fri", outfit: "Casual Friday" },
  { day: "Sat", outfit: "Weekend Vibes" },
  { day: "Sun", outfit: "Sunday Brunch" }
];

export default async function Dashboard() {
  const user = await getUserData();

  if (!user) {
    redirect("/login");
  }

  const isAdmin = user.role === "admin";

  return (
    <div className="min-h-screen bg-[#FFF7F7] text-[#260909]">
      <header className="border-b border-[#E7B8B8] bg-[#FFF7F7]/95 px-5 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href={ROUTES.dashboard} className="font-serif text-2xl font-bold text-[#820000] no-underline">
            FashioMe
          </Link>

          <nav className="flex items-center gap-2 text-sm font-semibold">
            <Link href={ROUTES.profile} className="rounded-full px-4 py-2 text-[#735656] no-underline transition hover:bg-white hover:text-[#820000]">
              Profile
            </Link>
            {isAdmin && (
              <Link href={ROUTES.admin} className="rounded-full px-4 py-2 bg-[#820000] text-white no-underline transition hover:bg-[#A41515]">
                Admin Panel
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="px-5 py-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-[#820000]">
              Welcome back, {user.firstName}
            </h1>
            <p className="text-sm text-[#735656]">Your personal style journey continues</p>
          </div>

          <section className="rounded-lg bg-[#4A0000] p-8 text-white shadow-[0_18px_40px_rgba(74,29,29,0.14)]">
            <div className="flex items-center gap-3 mb-6">
              <Crown className="h-8 w-8 text-[#FFDADA]" />
              <h2 className="text-2xl font-bold">Editorial Picks</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {editorialPicks.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg bg-white/10">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FFDADA]">{item.category}</p>
                      <p className="mt-1 text-lg font-bold">{item.title}</p>
                   
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-[#E7B8B8] bg-white p-6 shadow-[0_10px_30px_rgba(74,29,29,0.06)]">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-6 w-6 text-[#A41515]" />
                <h2 className="text-xl font-bold text-[#260909]">Style Confidence</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-[#735656]">Overall Style Score</span>
                    <span className="font-bold text-[#820000]">88%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#FFECEC]">
                    <div className="h-full w-[88%] rounded-full bg-[#820000]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-[#735656]">Wardrobe Variety</span>
                    <span className="font-bold text-[#820000]">75%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#FFECEC]">
                    <div className="h-full w-[75%] rounded-full bg-[#A41515]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-[#735656]">Occasion Coverage</span>
                    <span className="font-bold text-[#820000]">92%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#FFECEC]">
                    <div className="h-full w-[92%] rounded-full bg-[#A41515]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-[#E7B8B8] bg-white p-6 shadow-[0_10px_30px_rgba(74,29,29,0.06)]">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="h-6 w-6 text-[#A41515]" />
                <h2 className="text-xl font-bold text-[#260909]">Browse by Occasion</h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {occasions.map((occasion) => (
                  <Link
                    key={occasion.name}
                    href="#"
                    className="flex flex-col items-center gap-2 rounded-lg bg-[#FFF7F7] p-4 text-center transition hover:bg-[#FFECEC] hover:shadow-md"
                  >
                    <span className="text-2xl">{occasion.icon}</span>
                    <span className="text-xs font-semibold text-[#260909]">{occasion.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-[#E7B8B8] bg-white p-6 shadow-[0_10px_30px_rgba(74,29,29,0.06)]">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-6 w-6 text-[#A41515]" />
              <h2 className="text-xl font-bold text-[#260909]">Weekly Style Archive</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-7">
              {weeklyArchive.map((item) => (
                <div key={item.day} className="text-center">
                  <div className="mb-2 text-sm font-bold text-[#820000]">{item.day}</div>
                  <div className="rounded-lg bg-[#FFF7F7] p-3">
                    <p className="text-xs font-semibold text-[#260909]">{item.outfit}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg bg-[#820000] p-8 text-white shadow-[0_18px_40px_rgba(74,29,29,0.14)]">
            <div className="flex items-start gap-4">
              <Quote className="h-8 w-8 text-[#FFDADA] shrink-0" />
              <div>
                <p className="text-lg italic leading-relaxed">
                  "Fashion is not something that exists in dresses only. Fashion is in the sky, in the street. Fashion has to do with ideas, the way we live."
                </p>
                <p className="mt-4 text-sm font-semibold text-[#FFDADA]">— Coco Chanel</p>
              </div>
            </div>
          </section>

          <footer className="border-t border-[#E7B8B8] bg-white py-6 text-center text-sm text-[#735656]">
            <p>© 2024 FashioMe. Your personal style journey.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
