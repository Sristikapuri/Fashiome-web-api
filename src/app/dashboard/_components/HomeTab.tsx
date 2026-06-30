'use client';

import { useState, useTransition } from "react";
import Image from "next/image";
import { Crown, Sparkles, Heart, Calendar } from "lucide-react";
import { handleGenerateOutfit } from "@/lib/actions/home-action";

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

function normalizeImageSrc(src?: string, fallback = "/images/welcome/hero-gown.jpg") {
  if (!src) return fallback;
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("blob:") ||
    src.startsWith("data:")
  ) {
    return src;
  }
  if (src.startsWith("assets/") || src.startsWith("/assets/")) {
    const name = src.split("/").pop() || "";
    const assetMap: Record<string, string> = {
      "ai_wedding_formal.jpg": "/images/welcome/hero-editorial.jpg",
      "outfit.jpg": "/images/welcome/hero-blazer.jpg",
      "party.jpg": "/images/welcome/hero-gown.jpg",
      "travel.jpg": "/images/welcome/hero-street.jpg",
      "weekend.jpg": "/images/welcome/hero-blazer.jpg",
      "brunch.jpg": "/images/welcome/hero-gown.jpg",
      "wedding.jpg": "/images/welcome/hero-gown.jpg",
    };
    return assetMap[name] || fallback;
  }
  if (src.startsWith("/")) {
    return src;
  }
  return `/${src}`;
}

export function HomeTab({ user, dashboardData }: { user: any, dashboardData?: any }) {
  const [selectedOccasion, setSelectedOccasion] = useState<string>('Wedding');
  const [selectedArchiveDay, setSelectedArchiveDay] = useState<string>('Mon');
  const [generatedRecommendation, setGeneratedRecommendation] = useState<any>(
    dashboardData?.aiStyleOfDay || dashboardData?.recommendations?.[0] || null
  );
  const [generationError, setGenerationError] = useState("");
  const [isGenerating, startTransition] = useTransition();

  const generateForOccasion = (occasion: string) => {
    setSelectedOccasion(occasion);
    setGenerationError("");

    startTransition(async () => {
      try {
        const result = await handleGenerateOutfit({
          occasion,
          source: "My Wardrobe",
          profileData: user || {},
        });

        if (result.success) {
          setGeneratedRecommendation(result.data);
          return;
        }

        setGenerationError(result.message || "Failed to generate recommendation");
      } catch (error: any) {
        setGenerationError(error?.message || "Failed to generate recommendation");
      }
    });
  };

  const editorialPicks = dashboardData?.recommendations?.length > 0 
    ? dashboardData.recommendations.map((rec: any, idx: number) => ({
        id: rec.id || idx,
        title: rec.title,
        category: rec.category,
        image: normalizeImageSrc(
          rec.imageUrl?.startsWith('/')
            ? `http://localhost:8089${rec.imageUrl}`
            : rec.imageUrl
        )
      }))
    : [
        { id: 1, title: "Summer Dress", category: "Summer", image: "/images/welcome/hero-gown.jpg" },
        { id: 2, title: "Blazer Set", category: "Winter", image: "/images/welcome/hero-editorial.jpg" },
        { id: 3, title: "Jacket", category: "Casual", image: "/images/welcome/hero-blazer.jpg" }
      ];

  const currentScore = dashboardData ? 92 : 88;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-[#820000]">
          Welcome back, {user?.firstName || 'User'}
        </h1>
        <p className="text-sm text-[#735656]">Your personal style journey continues</p>
      </div>

      <section className="rounded-xl bg-gradient-to-br from-[#4A0000] to-[#820000] p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Crown className="h-8 w-8 text-[#FFDADA]" />
          <h2 className="text-2xl font-bold">Editorial Picks</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {editorialPicks.map((item: any) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl bg-white/10 aspect-[4/5]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFDADA] mb-2">{item.category}</p>
                  <p className="text-xl font-bold leading-tight">{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#E7B8B8] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-6 w-6 text-[#A41515]" />
            <h2 className="text-xl font-bold text-[#260909]">Style Confidence</h2>
          </div>
          <div className="space-y-5">
            {[
              { label: 'Overall Style Score', score: currentScore, color: 'bg-[#820000]' },
              { label: 'Wardrobe Variety', score: 75, color: 'bg-[#A41515]' },
              { label: 'Occasion Coverage', score: 92, color: 'bg-[#C81A1A]' }
            ].map((stat) => (
              <div key={stat.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-[#735656]">{stat.label}</span>
                  <span className="font-bold text-[#820000]">{stat.score}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#FFECEC]">
                  <div className={`h-full ${stat.color} transition-all duration-1000 ease-out`} style={{ width: `${stat.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[#E7B8B8] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="h-6 w-6 text-[#A41515]" />
            <h2 className="text-xl font-bold text-[#260909]">Browse by Occasion</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {occasions.map((occasion) => (
                <button
                  key={occasion.name}
                  type="button"
                  onClick={() => generateForOccasion(occasion.name)}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl p-4 text-center transition-all hover:scale-105 ${
                    selectedOccasion === occasion.name
                      ? 'bg-[#820000] text-white shadow-md'
                      : 'bg-[#FFF7F7] hover:bg-[#FFECEC]'
                  }`}
              >
                <span className="text-3xl mb-1">{occasion.icon}</span>
                <span className={`text-xs font-semibold ${selectedOccasion === occasion.name ? 'text-white' : 'text-[#260909]'}`}>{occasion.name}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#735656]">
            Selected occasion: <span className="font-semibold text-[#820000]">{selectedOccasion}</span>
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-[#E7B8B8] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="h-6 w-6 text-[#A41515]" />
          <h2 className="text-xl font-bold text-[#260909]">Recommended Outfit</h2>
        </div>

        {generationError ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {generationError}
          </div>
        ) : null}

        {isGenerating ? (
          <div className="rounded-xl bg-[#FFF7F7] px-4 py-6 text-sm font-medium text-[#735656]">
            Generating your {selectedOccasion.toLowerCase()} outfit...
          </div>
        ) : generatedRecommendation ? (
          <div className="grid gap-5 md:grid-cols-[280px_1fr] items-start">
            <div className="relative overflow-hidden rounded-2xl bg-[#FFF7F7] aspect-[4/5]">
              <Image
                src={normalizeImageSrc(
                  generatedRecommendation.imageUrl?.startsWith('/')
                    ? `http://localhost:8089${generatedRecommendation.imageUrl}`
                    : generatedRecommendation.imageUrl
                )}
                alt={generatedRecommendation.title || `${selectedOccasion} outfit`}
                fill
                sizes="(max-width: 768px) 100vw, 280px"
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A41515]">
                  {generatedRecommendation.occasion || selectedOccasion}
                </p>
                <h3 className="mt-2 text-2xl font-bold text-[#260909]">
                  {generatedRecommendation.title || "Custom outfit recommendation"}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#735656]">
                  {generatedRecommendation.explanation || "Your outfit recommendation is ready."}
                </p>
              </div>

              {generatedRecommendation.outfit ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Outfit</p>
                  <p className="mt-2 rounded-xl bg-[#FFF7F7] px-4 py-3 text-sm text-[#260909]">
                    {generatedRecommendation.outfit}
                  </p>
                </div>
              ) : null}

              {generatedRecommendation.paletteLabels?.length ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Palette</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {generatedRecommendation.paletteLabels.slice(0, 4).map((color: string) => (
                      <span
                        key={color}
                        className="rounded-full bg-[#FFF7F7] px-3 py-1 text-xs font-semibold text-[#820000]"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-[#FFF7F7] px-4 py-6 text-sm font-medium text-[#735656]">
            Pick an occasion above to generate an outfit recommendation.
          </div>
        )}
      </section>

      <section className="rounded-xl border border-[#E7B8B8] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-6 w-6 text-[#A41515]" />
          <h2 className="text-xl font-bold text-[#260909]">Weekly Style Archive</h2>
        </div>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-7">
          {weeklyArchive.map((item) => (
            <button
              key={item.day}
              type="button"
              onClick={() => setSelectedArchiveDay(item.day)}
              className="text-center group cursor-pointer"
            >
              <div className="mb-2 text-sm font-bold text-[#820000]">{item.day}</div>
              <div className={`rounded-xl p-4 transition-colors h-20 flex items-center justify-center ${
                selectedArchiveDay === item.day ? 'bg-[#820000] text-white shadow-md' : 'bg-[#FFF7F7] group-hover:bg-[#FFECEC]'
              }`}>
                <p className={`text-xs font-semibold leading-tight ${selectedArchiveDay === item.day ? 'text-white' : 'text-[#260909]'}`}>{item.outfit}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
