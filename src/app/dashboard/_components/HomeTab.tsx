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

export function HomeTab({ user, dashboardData, dashboardError, dashboardLoading }: { user: any, dashboardData?: any, dashboardError?: string, dashboardLoading?: boolean }) {
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
  const selectedWeekSavedCount = useMemo(
    () => resolvedArchive.filter((item) => Boolean(item.updatedAt)).length,
    [resolvedArchive]
  );
  const selectedArchiveHasSavedLook = Boolean(selectedArchiveEntry?.updatedAt);

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

  const recommendationSource = Array.isArray(dashboardData?.recommendations)
    ? dashboardData.recommendations
    : dashboardData?.aiStyleOfDay
      ? [dashboardData.aiStyleOfDay]
      : [];

  const editorialPicks = recommendationSource.length > 0
    ? recommendationSource.map((rec: any, idx: number) => ({
        id: rec.id || idx,
        title: rec.title || rec.outfit || "Your style recommendation",
        category: rec.category || rec.occasion || "Personalized look",
        image: normalizeImageSrc(
          resolveApiImageUrl(rec.imageUrl) || rec.imageUrl
        )
      }))
    : [];

  const stylePulseMessage = dashboardLoading
    ? "Generating today's style pulse..."
    : dashboardError
      ? "Connect to your style engine to see live updates."
      : editorialPicks.length > 0 || archiveEntries.length > 0
        ? "Your style activity is up to date."
        : "Generate your first look to start your style pulse.";
  const stylePulseImage = normalizeImageSrc(
    resolveApiImageUrl(generatedRecommendation?.imageUrl) || generatedRecommendation?.imageUrl,
    "/images/welcome/hero-editorial.jpg"
  );

  return (
    <div className="mx-auto max-w-6xl space-y-10 bg-[#FFF7F7] pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-5">
          <h1 className="text-4xl font-bold tracking-tight text-[#260909] sm:text-5xl">Welcome back, {user?.firstName || "User"}</h1>
          <p className="max-w-xl text-base leading-7 text-[#735656]">
            Your personal style journey continues with live outfit suggestions, a real wardrobe archive, and editorial picks built for the way you dress.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => generateForOccasion(selectedOccasion)}
              disabled={isGenerating}
              className="rounded-xl bg-[#820000] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6d0000] disabled:cursor-wait disabled:opacity-60"
            >
              Generate New Look
            </button>
            <a
              href="#weekly-archive"
              className="rounded-xl border border-[#E7B8B8] bg-white px-6 py-3 text-sm font-semibold text-[#820000] transition-colors hover:bg-[#FFF7F7]"
            >
              View Wardrobe Archive
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-[#F0E2E0] bg-[#FBF8F7] p-6 text-[#260909] sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#820000]">Today’s style pulse</p>
          <h3 className="mt-3 text-xl font-bold text-[#260909]">
            {generatedRecommendation?.title || "A look selected for your style"}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#735656]">{stylePulseMessage}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-2xl bg-white p-4">
              <p className="text-2xl font-black text-[#820000]">{editorialPicks.length}</p>
              <p className="mt-1 text-xs font-semibold text-[#9a7e74]">Recommendations</p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <p className="text-2xl font-black text-[#820000]">{archiveEntries.length}</p>
              <p className="mt-1 text-xs font-semibold text-[#9a7e74]">Saved looks</p>
            </div>
          </div>
        </div>
      </section>

      {dashboardError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          We couldn&apos;t load your live style recommendations right now. Live recommendations will appear when the service is available.
        </div>
      ) : null}

      <section>
        <div className="mb-6 flex items-center gap-3">
          <Crown className="h-7 w-7 text-[#A41515]" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a7e74]">Editorial picks</p>
            <h2 className="text-2xl font-bold text-[#260909]">Curated looks selected for you</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {dashboardLoading ? (
            [0, 1, 2].map((idx) => (
              <div key={idx} className="animate-pulse">
                <div className="aspect-[4/5] rounded-2xl border border-[#E7B8B8] bg-[#FFF1F1]" />
                <div className="mt-3 h-3 w-1/3 rounded bg-[#FFE5E5]" />
                <div className="mt-2 h-4 w-2/3 rounded bg-[#FFE5E5]" />
              </div>
            ))
          ) : editorialPicks.length > 0 ? editorialPicks.map((item: any) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#E7B8B8] bg-[#FFF7F7]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={handleImageError}
                />
              </div>
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A41515]">{item.category}</p>
                <p className="mt-1 text-base font-bold text-[#260909]">{item.title}</p>
              </div>
            </div>
          )) : (
            <div className="rounded-2xl border border-[#E7B8B8] bg-[#FFF7F7] p-6 text-sm text-[#735656] md:col-span-3">
              Live editorial recommendations are unavailable right now. Please refresh when the backend is online.
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="rounded-[2rem] border border-[#E7B8B8] bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-[#A41515]" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Style Activity</p>
                <h2 className="text-xl font-bold text-[#260909]">Your real styling activity</h2>
              </div>
            </div>
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#FFF7F7]">
              <Image
                src={stylePulseImage}
                alt="Style activity preview"
                fill
                sizes="56px"
                unoptimized
                className="object-cover"
                onError={handleImageError}
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Saved looks", value: archiveEntries.length, description: "in your weekly archive" },
              { label: "Weeks tracked", value: savedWeekKeys.length, description: "with saved styling activity" },
              { label: "Recommendations", value: editorialPicks.length, description: "available from your profile" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-[#FFF7F7] p-4">
                <p className="text-2xl font-black text-[#820000]">{stat.value}</p>
                <p className="mt-1 text-sm font-bold text-[#260909]">{stat.label}</p>
                <p className="mt-1 text-xs text-[#735656]">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#E7B8B8] bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-7">
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

      <section className="rounded-[2rem] border border-[#E7B8B8] bg-white p-6 shadow-sm sm:p-8">
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
          <div className="grid items-center gap-5 rounded-3xl bg-[#FFF7F7] p-4 sm:grid-cols-[150px_1fr] sm:p-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#FFECEC]">
              <Image
                src="/images/welcome/hero-editorial.jpg"
                alt="FashioMe outfit inspiration"
                fill
                sizes="150px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A41515]">Your next look</p>
              <h3 className="mt-2 text-lg font-bold text-[#260909]">Ready to style something new?</h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#735656]">
                Choose an occasion above and let FashioMe build a personalized outfit direction for you.
              </p>
              <button
                type="button"
                onClick={() => generateForOccasion(selectedOccasion)}
                disabled={isGenerating}
                className="mt-4 rounded-full bg-[#820000] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#6d0000] disabled:cursor-wait disabled:opacity-60"
              >
                Generate {selectedOccasion} look
              </button>
            </div>
          </div>
        )}
      </section>

      <section id="weekly-archive" className="rounded-[2rem] border border-[#E7B8B8] bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF1F1] text-[#A41515]">
                <Calendar className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Weekly Style Archive</p>
                <h2 className="text-xl font-bold text-[#260909]">Your saved outfits, week by week</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#735656]">
              Browse your style history by week, reopen a saved look, and regenerate any day when you want a fresh version.
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-3 sm:items-end">
            <div className="rounded-full border border-[#E7B8B8] bg-[#FFF7F7] px-4 py-2 text-sm font-semibold text-[#820000]">
              {selectedWeekLabel}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#735656]">
              <button
                type="button"
                onClick={() => setSelectedWeekStart((current) => addDays(current, -7))}
                className="rounded-full border border-[#E7B8B8] bg-white px-3 py-2 font-semibold text-[#820000] transition-colors hover:bg-[#FFF1F1]"
              >
                Prev week
              </button>
              <button
                type="button"
                onClick={() => setSelectedWeekStart((current) => addDays(current, 7))}
                className="rounded-full border border-[#E7B8B8] bg-white px-3 py-2 font-semibold text-[#820000] transition-colors hover:bg-[#FFF1F1]"
              >
                Next week
              </button>
            </div>
          </div>
        </div>
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedWeekStart(startOfWeek(new Date()))}
            className="rounded-full border border-[#E7B8B8] bg-[#FFF7F7] px-3 py-1.5 text-xs font-semibold text-[#820000] transition-colors hover:bg-[#FFF1F1]"
          >
            Current week
          </button>
          {savedWeekKeys.slice(0, 6).map((weekKey) => (
            <button
              key={weekKey}
              type="button"
              onClick={() => setSelectedWeekStart(startOfWeek(new Date(`${weekKey}T00:00:00`)))}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                weekKey === currentWeekKey
                  ? "border-[#820000] bg-[#820000] text-white"
                  : "border-[#E7B8B8] bg-[#FFF7F7] text-[#820000] hover:bg-[#FFF1F1]"
              }`}
            >
              {weekKey}
            </button>
          ))}
        </div>
        <div className="grid items-start gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="rounded-3xl border border-[#E7B8B8] bg-[#FFF9F9] p-4">
            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Saved this week</p>
                <p className="mt-2 text-3xl font-black text-[#820000]">{selectedWeekSavedCount}</p>
                <p className="mt-1 text-sm text-[#735656]">Looks already archived for this week.</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Selected day</p>
                <p className="mt-2 text-xl font-bold text-[#260909]">{selectedArchiveEntry?.day || "Mon"}</p>
                <p className="mt-1 text-sm text-[#735656]">{selectedArchiveEntry?.date || "Choose a day"}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Status</p>
                <p className="mt-2 text-xl font-bold text-[#260909]">
                  {selectedArchiveHasSavedLook ? "Saved look" : "Open slot"}
                </p>
                <p className="mt-1 text-sm text-[#735656]">
                  {selectedArchiveHasSavedLook ? "Ready to revisit or regenerate." : "Generate a new outfit for this day."}
                </p>
              </div>
            </div>

            <div className="mt-4 grid max-h-[520px] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-1">
              {resolvedArchive.map((item) => {
                const isSelected = selectedArchiveDay === item.day;
                const hasSavedLook = Boolean(item.updatedAt);

                return (
                  <button
                    key={`${currentWeekKey}-${item.day}`}
                    type="button"
                    onClick={() => {
                      setSelectedArchiveDay(item.day);
                      if (hasSavedLook) {
                        generateForArchiveDay(item.day, item.outfit || item.occasion, item.occasion || item.day);
                      }
                    }}
                    disabled={isGenerating}
                    className={`group rounded-2xl border p-4 text-left transition-all disabled:cursor-wait disabled:opacity-50 ${
                      isSelected
                        ? "border-[#820000] bg-[#820000] text-white shadow-[0_18px_40px_-24px_rgba(130,0,0,0.95)]"
                        : "border-[#E7B8B8] bg-white hover:border-[#d8aaaa] hover:bg-[#FFF3F3]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className={`text-sm font-bold ${isSelected ? "text-white" : "text-[#820000]"}`}>{item.day}</div>
                        <div className={`mt-1 text-[10px] uppercase tracking-[0.18em] ${isSelected ? "text-white/75" : "text-[#9a7e74]"}`}>
                          {item.date}
                          {item.isToday ? " · Today" : ""}
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          isSelected
                            ? "bg-white/15 text-white"
                            : hasSavedLook
                              ? "bg-[#FFF3F3] text-[#820000]"
                              : "bg-[#F6F1F1] text-[#735656]"
                        }`}
                      >
                        {hasSavedLook ? "Saved" : "Empty"}
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className={`text-sm font-semibold leading-6 ${isSelected ? "text-white" : "text-[#260909]"}`}>
                        {hasSavedLook ? item.outfit : `No saved outfit for ${item.day} yet.`}
                      </p>
                      <p className={`mt-2 text-xs ${isSelected ? "text-white/80" : "text-[#735656]"}`}>
                        {hasSavedLook ? item.occasion || "Tap to regenerate this look" : "Select this day to prepare a fresh outfit idea."}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedArchiveEntry ? (
            <div className="overflow-hidden rounded-3xl border border-[#E7B8B8] bg-[#FFF7F7]">
              <div className="grid gap-0 lg:grid-cols-[300px_minmax(0,1fr)]">
                <div className="relative min-h-[300px] bg-white">
                  <Image
                    src={normalizeImageSrc(selectedArchiveEntry.imageUrl)}
                    alt={selectedArchiveEntry.title || selectedArchiveEntry.outfit || "Saved outfit"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 300px"
                    unoptimized
                    className="object-cover"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-5 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">
                      {selectedArchiveEntry.day} · {selectedArchiveEntry.date}
                    </p>
                    <p className="mt-2 text-lg font-bold">
                      {selectedArchiveHasSavedLook ? (selectedArchiveEntry.occasion || "Saved look") : "Ready for a new look"}
                    </p>
                  </div>
                </div>
                <div className="p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#820000]">
                      {selectedArchiveEntry.occasion || "Look"}
                    </span>
                    <span className="rounded-full border border-[#E7B8B8] px-3 py-1 text-xs font-semibold text-[#735656]">
                      {selectedArchiveHasSavedLook ? "Saved in archive" : "No saved entry yet"}
                    </span>
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-[#260909]">
                    {selectedArchiveHasSavedLook
                      ? (selectedArchiveEntry.title || selectedArchiveEntry.outfit || "Saved outfit")
                      : `Plan a look for ${selectedArchiveEntry.day}`}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#735656]">
                    {selectedArchiveHasSavedLook
                      ? (selectedArchiveEntry.explanation ||
                        "This archived look can be regenerated or used as the starting point for a new outfit recommendation.")
                      : "This day does not have a saved outfit yet. Generate one to start building a complete weekly archive."}
                  </p>

                  {selectedArchiveHasSavedLook && selectedArchiveEntry.outfit ? (
                    <div className="mt-5 rounded-2xl bg-white px-4 py-4 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Outfit summary</p>
                      <p className="mt-2 text-sm leading-6 text-[#260909]">{selectedArchiveEntry.outfit}</p>
                    </div>
                  ) : null}

                  {selectedArchiveEntry.paletteLabels?.length ? (
                    <div className="mt-5">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Palette</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedArchiveEntry.paletteLabels.slice(0, 4).map((label) => (
                          <span key={label} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#820000] shadow-sm">
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {selectedArchiveEntry.wardrobeItemsUsed?.length ? (
                    <div className="mt-5">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Wardrobe items used</p>
                      <p className="mt-2 text-sm leading-6 text-[#260909]">
                        {selectedArchiveEntry.wardrobeItemsUsed.join(", ")}
                      </p>
                    </div>
                  ) : null}

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        generateForArchiveDay(
                          selectedArchiveEntry.day,
                          selectedArchiveEntry.outfit || selectedArchiveEntry.occasion || selectedArchiveEntry.day,
                          selectedArchiveEntry.occasion || selectedArchiveEntry.day
                        )
                      }
                      disabled={isGenerating}
                      className="rounded-full bg-[#820000] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6d0000] disabled:cursor-wait disabled:opacity-60"
                    >
                      {selectedArchiveHasSavedLook ? "Regenerate this look" : "Generate outfit for this day"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedWeekStart(startOfWeek(new Date()))}
                      className="rounded-full border border-[#E7B8B8] bg-white px-5 py-3 text-sm font-semibold text-[#820000] transition-colors hover:bg-[#FFF1F1]"
                    >
                      Jump to current week
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
