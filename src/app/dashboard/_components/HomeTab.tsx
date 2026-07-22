'use client';

import { useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { Crown, Sparkles, Heart, Calendar } from "lucide-react";
import { handleGenerateOutfit, handleGetStyleArchive, handleSaveStyleArchiveEntry } from "@/lib/actions/home-action";
import { resolveApiImageUrl } from "@/lib/image-url";

const occasions = [
  { name: "Wedding", icon: "💍" },
  { name: "Party", icon: "🎉" },
  { name: "Office", icon: "💼" },
  { name: "Casual", icon: "🌟" },
  { name: "Festival", icon: "🎊" },
  { name: "Date Night", icon: "❤️" },
  { name: "Gala", icon: "✨" },
  { name: "Street Style", icon: "🧢" },
  { name: "Beach", icon: "🏖️" },
  { name: "Sangeet", icon: "💃" },
  { name: "Black Tie", icon: "🎩" },
  { name: "Brunch", icon: "☕" },
  { name: "Formal", icon: "👔" },
  { name: "Travel", icon: "✈️" }
];

type WeeklyArchiveEntry = {
  weekKey: string;
  day: string;
  occasion: string;
  title?: string;
  outfit?: string;
  imageUrl?: string;
  explanation?: string;
  paletteLabels?: string[];
  wardrobeItemsUsed?: string[];
  updatedAt?: string;
};

type WeekDay = {
  day: string;
  label: string;
  date: string;
  dateKey: string;
  isToday: boolean;
};

const IMAGE_FALLBACK = "/images/welcome/hero-gown.jpg";

function normalizeImageSrc(src?: string, fallback = IMAGE_FALLBACK) {
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

function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  (e.target as HTMLImageElement).src = IMAGE_FALLBACK;
}

function startOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day + 6) % 7;
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

function formatWeekKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, amount: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function buildWeekDays(weekStart: Date): WeekDay[] {
  const todayKey = new Date().toISOString().slice(0, 10);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return labels.map((label, index) => {
    const current = addDays(weekStart, index);
    const dateKey = current.toISOString().slice(0, 10);
    return {
      day: label,
      label,
      date: current.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      dateKey,
      isToday: dateKey === todayKey,
    };
  });
}

export function HomeTab({ user, dashboardData, dashboardError }: { user: any, dashboardData?: any, dashboardError?: string }) {
  const [selectedOccasion, setSelectedOccasion] = useState<string>('Wedding');
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(() => startOfWeek(new Date()));
  const [selectedArchiveDay, setSelectedArchiveDay] = useState<string>('Mon');
  const [archiveEntries, setArchiveEntries] = useState<WeeklyArchiveEntry[]>([]);
  const [generatedRecommendation, setGeneratedRecommendation] = useState<any>(
    dashboardData?.aiStyleOfDay || dashboardData?.recommendations?.[0] || null
  );
  const [generationError, setGenerationError] = useState("");
  const [isGenerating, startTransition] = useTransition();

  useEffect(() => {
    let active = true;
    void handleGetStyleArchive().then((result) => {
      if (!active || !result.success || !result.data?.styleArchive) return;
      setArchiveEntries(result.data.styleArchive as WeeklyArchiveEntry[]);
    });
    return () => {
      active = false;
    };
  }, []);

  const currentWeekKey = useMemo(() => formatWeekKey(selectedWeekStart), [selectedWeekStart]);
  const weekDays = useMemo(() => buildWeekDays(selectedWeekStart), [selectedWeekStart]);
  const savedWeekKeys = useMemo(() => {
    const keys = Array.from(new Set(archiveEntries.map((entry) => entry.weekKey).filter(Boolean)));
    return keys.sort((left, right) => right.localeCompare(left));
  }, [archiveEntries]);
  const selectedWeekLabel = useMemo(
    () => selectedWeekStart.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    [selectedWeekStart]
  );

  const resolvedArchive = useMemo(() => {
    const weekEntries = archiveEntries.filter((entry) => entry.weekKey === currentWeekKey);
    return weekDays.map((item) => {
      const saved = weekEntries.find((entry) => entry.day === item.day);
      return {
        ...item,
        title: saved?.title || "",
        outfit: saved?.outfit || saved?.title || `${item.day} look`,
        occasion: saved?.occasion || "",
        imageUrl: saved?.imageUrl,
        explanation: saved?.explanation,
        paletteLabels: saved?.paletteLabels || [],
        wardrobeItemsUsed: saved?.wardrobeItemsUsed || [],
        updatedAt: saved?.updatedAt,
      };
    });
  }, [archiveEntries, currentWeekKey, weekDays]);
  const selectedArchiveEntry = useMemo(
    () => resolvedArchive.find((item) => item.day === selectedArchiveDay) || resolvedArchive[0],
    [resolvedArchive, selectedArchiveDay]
  );

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

  const generateForArchiveDay = (day: string, outfitTheme: string, occasion: string) => {
    setSelectedArchiveDay(day);
    setSelectedOccasion(occasion);
    setGenerationError("");

    startTransition(async () => {
      try {
        const result = await handleGenerateOutfit({
          occasion: outfitTheme,
          source: "My Wardrobe",
          profileData: user || {},
        });

        if (result.success) {
          setGeneratedRecommendation(result.data);
          void handleSaveStyleArchiveEntry({
            weekKey: currentWeekKey,
            day,
            occasion,
            title: result.data?.title,
            outfit: result.data?.outfit,
            imageUrl: result.data?.imageUrl,
            explanation: result.data?.explanation,
            paletteLabels: result.data?.paletteLabels || [],
            wardrobeItemsUsed: result.data?.wardrobeItemsUsed || [],
          }).then((archiveResult) => {
            if (archiveResult.success && archiveResult.data?.styleArchive) {
              setArchiveEntries(archiveResult.data.styleArchive as WeeklyArchiveEntry[]);
            }
          });
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
          resolveApiImageUrl(rec.imageUrl) || rec.imageUrl
        )
      }))
    : [];

  const currentScore = dashboardData ? 92 : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5b0000] via-[#820000] to-[#b01818] p-8 text-white shadow-[0_24px_80px_-36px_rgba(130,0,0,0.82)] sm:p-10">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#FFECEC] backdrop-blur">
              <Crown className="h-4 w-4" />
              Your style home
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Welcome back, {user?.firstName || "User"}</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#FFDADA]">
                Your personal style journey continues with live outfit suggestions, a real wardrobe archive, and editorial picks built for the way you dress.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">Weekly archive</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">Live recommendations</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">Occasion aware</span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FFECEC]">Today’s style pulse</p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-black/15 p-3">
                <p className="text-2xl font-bold">92</p>
                <p className="mt-1 text-xs text-[#FFDADA]">Occasion fit</p>
              </div>
              <div className="rounded-2xl bg-black/15 p-3">
                <p className="text-2xl font-bold">{archiveEntries.length}</p>
                <p className="mt-1 text-xs text-[#FFDADA]">Saved looks</p>
              </div>
              <div className="rounded-2xl bg-black/15 p-3">
                <p className="text-2xl font-bold">{savedWeekKeys.length}</p>
                <p className="mt-1 text-xs text-[#FFDADA]">Weeks tracked</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-black/20 blur-3xl" />
      </section>

      {dashboardError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {dashboardError} Live recommendations will appear when the service is available.
        </div>
      ) : null}

      <section className="rounded-2xl bg-gradient-to-br from-[#4A0000] to-[#820000] p-6 text-white shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <Crown className="h-8 w-8 text-[#FFDADA]" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFDADA]">Editorial picks</p>
            <h2 className="text-2xl font-bold">Curated looks selected for you</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {editorialPicks.length > 0 ? editorialPicks.map((item: any) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/10 shadow-lg">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#FFDADA]">{item.category}</p>
                  <p className="text-xl font-bold leading-tight">{item.title}</p>
                </div>
              </div>
            </div>
          )) : (
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 text-sm text-[#FFDADA] md:col-span-3">
              Live editorial recommendations are unavailable right now. Please refresh when the backend is online.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#E7B8B8] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-[#A41515]" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Style Confidence</p>
              <h2 className="text-xl font-bold text-[#260909]">How your wardrobe is performing</h2>
            </div>
          </div>
          <div className="space-y-5">
            {[
              { label: "Overall Style Score", score: currentScore, color: "bg-[#820000]" },
              { label: "Wardrobe Variety", score: 75, color: "bg-[#A41515]" },
              { label: "Occasion Coverage", score: 92, color: "bg-[#C81A1A]" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="mb-2 flex justify-between text-sm">
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

        <div className="rounded-2xl border border-[#E7B8B8] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-6 flex items-center gap-3">
            <Heart className="h-6 w-6 text-[#A41515]" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Browse by Occasion</p>
              <h2 className="text-xl font-bold text-[#260909]">Generate a look in one tap</h2>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {occasions.map((occasion) => (
              <button
                key={occasion.name}
                type="button"
                onClick={() => generateForOccasion(occasion.name)}
                className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-4 text-center transition-all hover:-translate-y-0.5 ${
                  selectedOccasion === occasion.name ? "bg-[#820000] text-white shadow-md" : "bg-[#FFF7F7] hover:bg-[#FFECEC]"
                }`}
              >
                <span className="mb-1 text-3xl">{occasion.icon}</span>
                <span className={`text-xs font-semibold ${selectedOccasion === occasion.name ? "text-white" : "text-[#260909]"}`}>{occasion.name}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#735656]">
            Selected occasion: <span className="font-semibold text-[#820000]">{selectedOccasion}</span>
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E7B8B8] bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-[#A41515]" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Recommended Outfit</p>
            <h2 className="text-xl font-bold text-[#260909]">Your current outfit direction</h2>
          </div>
        </div>

        {generationError ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{generationError}</div>
        ) : null}

        {isGenerating ? (
          <div className="flex items-center gap-3 rounded-2xl bg-[#FFF7F7] px-4 py-6 text-sm font-medium text-[#735656]">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#820000] border-t-transparent" />
            Generating your {selectedOccasion.toLowerCase()} outfit...
          </div>
        ) : generatedRecommendation ? (
          <div className="grid items-start gap-5 md:grid-cols-[280px_1fr]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#FFF7F7] shadow-inner">
              <Image
                src={normalizeImageSrc(
                  resolveApiImageUrl(generatedRecommendation.imageUrl) || generatedRecommendation.imageUrl
                )}
                alt={generatedRecommendation.title || `${selectedOccasion} outfit`}
                fill
                sizes="280px"
                unoptimized
                className="object-cover"
                onError={handleImageError}
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
                  <p className="mt-2 rounded-2xl bg-[#FFF7F7] px-4 py-3 text-sm text-[#260909]">{generatedRecommendation.outfit}</p>
                </div>
              ) : null}

              {generatedRecommendation.paletteLabels?.length ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Palette</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {generatedRecommendation.paletteLabels.slice(0, 4).map((color: string) => (
                      <span key={color} className="rounded-full bg-[#FFF7F7] px-3 py-1 text-xs font-semibold text-[#820000]">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {generatedRecommendation.wardrobeItemsUsed?.length ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">From Your Wardrobe</p>
                  <p className="mt-2 rounded-2xl bg-[#FFF7F7] px-4 py-3 text-sm text-[#260909]">
                    {generatedRecommendation.wardrobeItemsUsed.join(", ")}
                  </p>
                </div>
              ) : null}

              {generatedRecommendation.missingItemsToBuy?.length ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Shop These</p>
                  <p className="mt-2 rounded-2xl bg-[#FFF7F7] px-4 py-3 text-sm text-[#260909]">
                    {generatedRecommendation.missingItemsToBuy.join(", ")}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#FFF7F7] px-4 py-6 text-sm font-medium text-[#735656]">
            Pick an occasion above or a day from the Weekly Style Archive to generate an outfit recommendation.
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[#E7B8B8] bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-[#A41515]" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Weekly Style Archive</p>
              <h2 className="text-xl font-bold text-[#260909]">Your saved outfits, week by week</h2>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-[#735656]">
            <button
              type="button"
              onClick={() => setSelectedWeekStart((current) => addDays(current, -7))}
              className="rounded-full border border-[#E7B8B8] bg-[#FFF7F7] px-3 py-1 font-semibold text-[#820000]"
            >
              Prev week
            </button>
            <span>{selectedWeekLabel}</span>
            <button
              type="button"
              onClick={() => setSelectedWeekStart((current) => addDays(current, 7))}
              className="rounded-full border border-[#E7B8B8] bg-[#FFF7F7] px-3 py-1 font-semibold text-[#820000]"
            >
              Next week
            </button>
          </div>
        </div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedWeekStart(startOfWeek(new Date()))}
            className="rounded-full border border-[#E7B8B8] bg-[#FFF7F7] px-3 py-1 text-xs font-semibold text-[#820000]"
          >
            Current week
          </button>
          {savedWeekKeys.slice(0, 6).map((weekKey) => (
            <button
              key={weekKey}
              type="button"
              onClick={() => setSelectedWeekStart(startOfWeek(new Date(`${weekKey}T00:00:00`)))}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                weekKey === currentWeekKey
                  ? "border-[#820000] bg-[#820000] text-white"
                  : "border-[#E7B8B8] bg-[#FFF7F7] text-[#820000]"
              }`}
            >
              {weekKey}
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_0.85fr] lg:grid-cols-7">
          {resolvedArchive.map((item) => (
            <button
              key={`${currentWeekKey}-${item.day}`}
              type="button"
              onClick={() => generateForArchiveDay(item.day, item.outfit || item.occasion, item.occasion || item.day)}
              disabled={isGenerating}
              className="group cursor-pointer text-left disabled:cursor-wait disabled:opacity-50"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-[#820000]">{item.day}</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#9a7e74]">{item.date}</div>
                </div>
                {item.updatedAt ? (
                  <span className="rounded-full bg-[#FFF7F7] px-2 py-1 text-[10px] font-semibold text-[#735656]">Saved</span>
                ) : null}
              </div>
              <div
                className={`flex h-24 items-center justify-center rounded-2xl p-4 transition-all ${
                  selectedArchiveDay === item.day
                    ? "scale-105 bg-[#820000] text-white shadow-md"
                    : "bg-[#FFF7F7] group-hover:scale-105 group-hover:bg-[#FFECEC]"
                }`}
              >
                <p className={`text-xs font-semibold leading-tight ${selectedArchiveDay === item.day ? "text-white" : "text-[#260909]"}`}>
                  {item.outfit}
                </p>
              </div>
            </button>
          ))}
        </div>

        {selectedArchiveEntry ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#E7B8B8] bg-[#FFF7F7]">
            <div className="grid gap-0 lg:grid-cols-[260px_1fr]">
              <div className="relative min-h-[260px] bg-white">
                <Image
                  src={normalizeImageSrc(selectedArchiveEntry.imageUrl)}
                  alt={selectedArchiveEntry.title || selectedArchiveEntry.outfit || "Saved outfit"}
                  fill
                  sizes="260px"
                  unoptimized
                  className="object-cover"
                  onError={handleImageError}
                />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#820000]">
                    {selectedArchiveEntry.occasion || "Look"}
                  </span>
                  <span className="text-xs uppercase tracking-[0.18em] text-[#9a7e74]">{selectedArchiveDay}</span>
                </div>
                <h3 className="mt-3 text-2xl font-bold text-[#260909]">
                  {selectedArchiveEntry.title || selectedArchiveEntry.outfit || "Saved outfit"}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#735656]">
                  {selectedArchiveEntry.explanation ||
                    "This archived look can be regenerated or used as the starting point for a new outfit recommendation."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedArchiveEntry.paletteLabels?.slice(0, 4).map((label) => (
                    <span key={label} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#820000]">
                      {label}
                    </span>
                  ))}
                </div>
                {selectedArchiveEntry.wardrobeItemsUsed?.length ? (
                  <div className="mt-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Wardrobe items used</p>
                    <p className="mt-2 text-sm text-[#260909]">{selectedArchiveEntry.wardrobeItemsUsed.join(", ")}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
