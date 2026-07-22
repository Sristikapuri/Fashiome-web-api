"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Compass, Palette, BookOpen, Sparkles, TrendingUp, LoaderCircle } from "lucide-react";
import { handleGenerateOutfit, handleGetStyleArchive, handleGetTrends, handleGetWardrobe } from "@/lib/actions/home-action";
import { resolveApiImageUrl } from "@/lib/image-url";

type TrendCard = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption?: string;
  height?: number;
};

const GUIDES = [
  { id: 1, title: "Color Theory for Spring", readTime: "5 min", color: "bg-pink-100" },
  { id: 2, title: "Building a Capsule Wardrobe", readTime: "8 min", color: "bg-blue-100" },
  { id: 3, title: "Accessorizing 101", readTime: "4 min", color: "bg-violet-100" },
];

function resolveImage(value?: string) {
  if (!value) return "/images/welcome/hero-gown.jpg";
  const apiImage = resolveApiImageUrl(value);
  if (apiImage && apiImage !== value) return apiImage;
  if (value.startsWith("http")) return value;
  if (value.startsWith("assets/")) {
    const asset = value.split("/").pop() || "";
    const map: Record<string, string> = {
      "ai_wedding_formal.jpg": "/images/welcome/hero-editorial.jpg",
      "outfit.jpg": "/images/welcome/hero-blazer.jpg",
      "party.jpg": "/images/welcome/hero-gown.jpg",
      "travel.jpg": "/images/welcome/hero-street.jpg",
      "weekend.jpg": "/images/welcome/hero-blazer.jpg",
      "brunch.jpg": "/images/welcome/hero-gown.jpg",
      "wedding.jpg": "/images/welcome/hero-gown.jpg",
    };
    return map[asset] || "/images/welcome/hero-gown.jpg";
  }
  return value.startsWith("/") ? value : `/${value}`;
}

function deriveAutoOccasion(profileData?: any) {
  const styleMood = String(profileData?.styleMood || "").toLowerCase();
  const stylePrefs = Array.isArray(profileData?.stylePreferences)
    ? profileData.stylePreferences.join(" ").toLowerCase()
    : "";
  const combined = `${styleMood} ${stylePrefs}`;

  if (combined.includes("office") || combined.includes("work") || combined.includes("formal")) {
    return "Office";
  }
  if (combined.includes("party") || combined.includes("glam") || combined.includes("evening")) {
    return "Party";
  }
  if (combined.includes("wedding") || combined.includes("sangeet") || combined.includes("festival")) {
    return "Festival";
  }
  if (combined.includes("travel") || combined.includes("casual") || combined.includes("relaxed")) {
    return "Casual";
  }

  const day = new Date().getDay();
  if (day === 1 || day === 2) return "Office";
  if (day === 3) return "Casual";
  if (day === 4) return "Festival";
  if (day === 5) return "Date Night";
  if (day === 6) return "Party";
  return "Brunch";
}

function deriveAutoReason(profileData?: any) {
  const styleMood = String(profileData?.styleMood || "").toLowerCase();
  const stylePrefs = Array.isArray(profileData?.stylePreferences)
    ? profileData.stylePreferences.join(", ")
    : "";
  const styleParts = [styleMood, stylePrefs].filter(Boolean);
  if (styleParts.length > 0) {
    return `Based on your style profile: ${styleParts.join(" / ")}`;
  }

  return "Based on the current day and your live wardrobe context";
}

function normalizeArchiveOccasion(value?: string) {
  const text = String(value || "").toLowerCase();
  if (text.includes("office") || text.includes("work")) return "Office";
  if (text.includes("party") || text.includes("glam") || text.includes("night")) return "Party";
  if (text.includes("festival") || text.includes("wedding") || text.includes("sangeet")) return "Festival";
  if (text.includes("date")) return "Date Night";
  if (text.includes("brunch")) return "Brunch";
  if (text.includes("travel") || text.includes("casual") || text.includes("weekend")) return "Casual";
  return "Casual";
}

function deriveBestOccasion(profileData?: any, wardrobeCategories: string[] = [], archiveOccasions: string[] = []) {
  const occasions = ["Office", "Party", "Festival", "Casual", "Date Night", "Brunch", "Wedding"];
  const scores = new Map<string, number>(occasions.map((occasion) => [occasion, 0]));

  const styleMood = String(profileData?.styleMood || "").toLowerCase();
  const stylePrefs = Array.isArray(profileData?.stylePreferences)
    ? profileData.stylePreferences.join(" ").toLowerCase()
    : "";
  const combined = `${styleMood} ${stylePrefs}`;

  for (const occasion of occasions) {
    let score = 0;
    if (combined.includes(occasion.toLowerCase())) score += 6;
    if (occasion === "Office" && (combined.includes("work") || combined.includes("formal") || combined.includes("smart"))) score += 4;
    if (occasion === "Party" && (combined.includes("glam") || combined.includes("bold") || combined.includes("evening"))) score += 4;
    if (occasion === "Festival" && (combined.includes("festival") || combined.includes("wedding") || combined.includes("ethnic"))) score += 4;
    if (occasion === "Casual" && (combined.includes("casual") || combined.includes("relaxed") || combined.includes("weekend"))) score += 4;
    if (occasion === "Date Night" && (combined.includes("date") || combined.includes("romantic"))) score += 3;
    if (occasion === "Brunch" && (combined.includes("soft") || combined.includes("light") || combined.includes("easy"))) score += 3;

    if (wardrobeCategories.length > 0) {
      const categoryBlob = wardrobeCategories.join(" ").toLowerCase();
      if (occasion === "Office" && (categoryBlob.includes("shirts") || categoryBlob.includes("blazers") || categoryBlob.includes("pants"))) score += 3;
      if (occasion === "Party" && (categoryBlob.includes("dresses") || categoryBlob.includes("skirts") || categoryBlob.includes("outerwear"))) score += 3;
      if (occasion === "Festival" && (categoryBlob.includes("dresses") || categoryBlob.includes("skirts") || categoryBlob.includes("tops"))) score += 2;
      if (occasion === "Casual" && (categoryBlob.includes("tops") || categoryBlob.includes("pants") || categoryBlob.includes("shoes"))) score += 3;
      if (occasion === "Date Night" && (categoryBlob.includes("dresses") || categoryBlob.includes("outerwear") || categoryBlob.includes("shoes"))) score += 2;
      if (occasion === "Brunch" && (categoryBlob.includes("tops") || categoryBlob.includes("skirts") || categoryBlob.includes("accessories"))) score += 2;
    }

    const priorCount = archiveOccasions.filter((item) => item === occasion).length;
    score -= priorCount * 2;
    scores.set(occasion, score);
  }

  return occasions.sort((a, b) => (scores.get(b) || 0) - (scores.get(a) || 0))[0];
}

function explainOccasionChoice(profileData?: any, wardrobeCategories: string[] = [], archiveOccasions: string[] = [], chosenOccasion?: string) {
  const reasons: string[] = [];
  const styleMood = String(profileData?.styleMood || "").toLowerCase();
  const stylePrefs = Array.isArray(profileData?.stylePreferences)
    ? profileData.stylePreferences.join(" ").toLowerCase()
    : "";
  const combined = `${styleMood} ${stylePrefs}`;
  const occasion = chosenOccasion || deriveBestOccasion(profileData, wardrobeCategories, archiveOccasions);

  if (combined.includes("office") || combined.includes("work") || combined.includes("formal")) {
    reasons.push("style profile leans office/formal");
  }
  if (combined.includes("party") || combined.includes("glam") || combined.includes("evening")) {
    reasons.push("style profile leans party/evening");
  }
  if (combined.includes("wedding") || combined.includes("sangeet") || combined.includes("festival")) {
    reasons.push("style profile leans festive");
  }
  if (wardrobeCategories.length > 0) {
    reasons.push(`wardrobe supports ${wardrobeCategories.slice(0, 3).join(", ")}`);
  }
  if (archiveOccasions.includes(occasion)) {
    reasons.push(`recent archive activity includes ${occasion.toLowerCase()}`);
  }
  if (reasons.length === 0) {
    reasons.push("current day fallback and wardrobe context");
  }
  return reasons.slice(0, 3);
}

export function DiscoverTab({ profileData }: { profileData?: any }) {
  const [search, setSearch] = useState("");
  const [selectedTrendId, setSelectedTrendId] = useState<string>("");
  const [selectedGuideId, setSelectedGuideId] = useState<number>(GUIDES[0].id);
  const [trends, setTrends] = useState<TrendCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [forYou, setForYou] = useState<any>(null);
  const [forYouLoading, setForYouLoading] = useState(true);
  const [wardrobeSummary, setWardrobeSummary] = useState<{ count: number; categories: string[] }>({
    count: 0,
    categories: [],
  });
  const [archiveOccasions, setArchiveOccasions] = useState<string[]>([]);
  const autoOccasion = useMemo(
    () => deriveBestOccasion(profileData, wardrobeSummary.categories, archiveOccasions),
    [archiveOccasions, profileData, wardrobeSummary.categories]
  );
  const occasionReasons = useMemo(
    () => explainOccasionChoice(profileData, wardrobeSummary.categories, archiveOccasions, autoOccasion),
    [archiveOccasions, autoOccasion, profileData, wardrobeSummary.categories]
  );
  const autoReason = useMemo(() => {
    const reasons = [deriveAutoReason(profileData)];
    if (wardrobeSummary.categories.length) {
      reasons.push(`Wardrobe fit: ${wardrobeSummary.categories.join(", ")}`);
    }
    if (archiveOccasions.length) {
      reasons.push(`Recent archive history: ${Array.from(new Set(archiveOccasions)).join(", ")}`);
    }
    return reasons.join(" · ");
  }, [archiveOccasions, profileData, wardrobeSummary.categories]);
  const fitSummary = useMemo(() => {
    const parts = [
      profileData?.gender ? `Gender: ${String(profileData.gender)}` : "",
      profileData?.bodyType ? `Body: ${String(profileData.bodyType)}` : "",
      profileData?.faceShape ? `Face: ${String(profileData.faceShape)}` : "",
      profileData?.skinTone ? `Tone: ${String(profileData.skinTone)}` : "",
    ].filter(Boolean);
    return parts.join(" · ");
  }, [profileData]);

  useEffect(() => {
    let active = true;
    void handleGetTrends().then((result) => {
      if (!active) return;
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        const mapped = result.data.map((item: any) => ({
          id: String(item.id || item._id || item.title),
          title: item.title || "Trending look",
          category: item.category || "Trending",
          imageUrl: resolveImage(item.imageUrl),
          caption: item.caption || item.explanation || item.title || "",
          height: item.height || 240,
        }));
        setTrends(mapped);
        setSelectedTrendId(mapped[0]?.id || "");
      } else {
        setTrends([]);
        setSelectedTrendId("");
        setError(result.message || "No live trends are available right now.");
      }
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    void handleGenerateOutfit({
      occasion: autoOccasion,
      source: "My Wardrobe",
      profileData: profileData || {},
    }).then((result) => {
      if (!active) return;
      if (result.success && result.data) {
        setForYou(result.data);
      }
      setForYouLoading(false);
    });

    return () => {
      active = false;
    };
  }, [autoOccasion, profileData]);

  useEffect(() => {
    let active = true;
    void handleGetWardrobe().then((result) => {
      if (!active) return;
      if (result.success && Array.isArray(result.data)) {
        const categories = Array.from(
          new Set(
            result.data
              .map((item: any) => item.category)
              .filter(Boolean)
          )
        );
        setWardrobeSummary({
          count: result.data.length,
          categories: categories.slice(0, 6),
        });
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    void handleGetStyleArchive().then((result) => {
      if (!active) return;
      if (result.success && result.data?.styleArchive && Array.isArray(result.data.styleArchive)) {
        setArchiveOccasions(
          result.data.styleArchive
            .map((entry: any) => normalizeArchiveOccasion(entry.occasion))
            .slice(0, 12)
        );
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const visibleTrends = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return trends;
    return trends.filter((trend) =>
      [trend.title, trend.category, trend.caption].join(" ").toLowerCase().includes(query)
    );
  }, [search, trends]);

  const visibleGuides = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return GUIDES;
    return GUIDES.filter((guide) => guide.title.toLowerCase().includes(query));
  }, [search]);

  const selectedTrend = visibleTrends.find((trend) => trend.id === selectedTrendId) || visibleTrends[0];
  const selectedGuide = visibleGuides.find((guide) => guide.id === selectedGuideId) || visibleGuides[0];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6f0000] via-[#8b0f0f] to-[#b51b1b] p-8 shadow-[0_24px_80px_-36px_rgba(130,0,0,0.8)] sm:p-10">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-5 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#FFECEC] backdrop-blur">
              <Compass className="h-4 w-4" />
              Live fashion discovery
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Discover Looks Worth Wearing</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#FFDADA]">
                Explore live trend looks, personalized outfit suggestions, and practical styling guidance tailored to your wardrobe.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">Backend-powered trends</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">Wardrobe-aware suggestions</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">Style guides</span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#FFECEC]">Search the feed</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search trends, outfits, or style moods..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="min-w-0 flex-1 rounded-2xl border border-white/20 bg-white px-4 py-3 text-[#260909] shadow-lg focus:outline-none focus:ring-2 focus:ring-white/60"
              />
              <button
                type="button"
                onClick={() => setSelectedTrendId(visibleTrends[0]?.id || "")}
                className="rounded-2xl bg-black px-5 py-3 font-bold text-white shadow-lg transition-colors hover:bg-neutral-800"
              >
                Search
              </button>
            </div>
            <p className="mt-4 text-sm text-[#FFECEC]">
              {loading ? "Loading live trend looks..." : `Showing ${visibleTrends.length} trend${visibleTrends.length === 1 ? "" : "s"} and ${visibleGuides.length} style guide${visibleGuides.length === 1 ? "" : "s"}.`}
            </p>
          </div>
        </div>

        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-black/20 blur-3xl" />
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E7B8B8] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-[#A41515]" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">For You</p>
                <h2 className="text-xl font-bold text-[#260909]">Personalized outfit direction</h2>
              </div>
            </div>
              <span className="rounded-full bg-[#FFF7F7] px-3 py-1 text-xs font-semibold text-[#820000]">Adaptive to your profile</span>
            </div>

          {forYouLoading ? (
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#FFF7F7] px-4 py-3 text-sm text-[#735656]">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Crafting your personalized style direction...
            </div>
            ) : forYou ? (
              <div className="mt-5 grid gap-5 xl:grid-cols-[280px_1fr]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#FFF7F7] shadow-inner">
                  <Image
                    src={forYou.imageUrl || "/images/welcome/hero-gown.jpg"}
                    alt={forYou.title || "Personalized outfit"}
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">
                      {forYou.occasion || autoOccasion}
                    </p>
                    <h3 className="mt-1 text-2xl font-bold text-[#260909]">
                      {forYou.title || "Your custom recommendation"}
                    </h3>
                  </div>
                  <div className="rounded-2xl bg-[#FFF7F7] px-4 py-3 text-sm text-[#260909]">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Why this occasion</p>
                    <p className="mt-1">{autoReason}</p>
                  </div>
                  <div className="rounded-2xl border border-[#E7B8B8] bg-white px-4 py-3 text-sm text-[#260909]">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Decision breakdown</p>
                    <ul className="mt-2 space-y-1">
                      {occasionReasons.map((reason) => (
                        <li key={reason} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#820000]" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm leading-6 text-[#735656]">
                    {forYou.explanation || "A live outfit suggestion generated from your profile."}
                  </p>
                  <div className="rounded-2xl border border-[#E7B8B8] bg-[#FFF7F7] px-4 py-3 text-sm text-[#260909]">
                    {wardrobeSummary.count > 0 ? (
                      <>
                        Your wardrobe has {wardrobeSummary.count} item{wardrobeSummary.count === 1 ? "" : "s"} available for matching.
                        {wardrobeSummary.categories.length ? ` Categories: ${wardrobeSummary.categories.join(", ")}.` : ""}
                      </>
                    ) : (
                      "Add wardrobe pieces so the engine can match real items you already own."
                    )}
                  </div>
                  {fitSummary ? (
                    <div className="rounded-2xl bg-[#FFF7F7] px-4 py-3 text-sm text-[#260909]">
                      Fit profile: {fitSummary}
                    </div>
                  ) : null}
                  {Array.isArray(forYou.wardrobeItemsUsed) && forYou.wardrobeItemsUsed.length ? (
                    <div className="rounded-2xl border border-[#E7B8B8] bg-white px-4 py-3 text-sm text-[#260909]">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Matched wardrobe items</p>
                      <ul className="mt-2 space-y-1">
                        {forYou.wardrobeItemsUsed.slice(0, 4).map((item: string) => (
                          <li key={item} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#820000]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {Array.isArray(forYou.paletteLabels) && forYou.paletteLabels.length ? (
                    <div className="flex flex-wrap gap-2">
                      {forYou.paletteLabels.slice(0, 4).map((label: string) => (
                        <span key={label} className="rounded-full bg-[#FFF7F7] px-3 py-1 text-xs font-semibold text-[#820000]">
                          {label}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl bg-[#FFF7F7] px-4 py-3 text-sm text-[#735656]">
                We could not generate a personalized direction yet, but the live trends below are still available.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-[#A41515]" />
            <h2 className="text-xl font-bold text-[#260909]">Trending Right Now</h2>
            </div>
            <span className="rounded-full border border-[#E7B8B8] bg-white px-3 py-1 text-xs font-semibold text-[#735656]">
              Tap a card to preview
            </span>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 rounded-2xl border border-[#E7B8B8] bg-white p-6 text-sm text-[#735656]">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Loading live outfit inspiration...
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {visibleTrends.map((trend) => (
                <button
                  key={trend.id}
                  type="button"
                  onClick={() => setSelectedTrendId(trend.id)}
                  className={`group relative overflow-hidden rounded-xl text-left shadow-sm transition-all duration-300 hover:shadow-xl ${
                    selectedTrendId === trend.id ? "ring-2 ring-[#A41515] ring-offset-2 ring-offset-white" : ""
                  }`}
                >
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={trend.imageUrl}
                      alt={trend.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-end justify-between gap-3">
                        <h3 className="text-lg font-bold leading-tight text-white">{trend.title}</h3>
                        <span className="whitespace-nowrap rounded bg-white/20 px-2 py-1 text-xs font-semibold text-white backdrop-blur-md">
                          {trend.category}
                        </span>
                      </div>
                      {trend.caption ? <p className="mt-2 text-xs leading-5 text-[#FFECEC]">{trend.caption}</p> : null}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedTrend ? (
            <div className="rounded-2xl border border-[#E7B8B8] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-[#A41515]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Live Outfit Direction</p>
                  <h3 className="text-xl font-bold text-[#260909]">{selectedTrend.title}</h3>
                </div>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-[240px_1fr]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#FFF7F7]">
                  <Image
                    src={selectedTrend.imageUrl}
                    alt={selectedTrend.title}
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-sm leading-6 text-[#735656]">
                    {selectedTrend.caption || "This look is sourced from the backend trend engine and reflects a current outfit direction you can build on."}
                  </p>
                  <div className="rounded-2xl bg-[#FFF7F7] px-4 py-3 text-sm text-[#260909]">
                    Try styling it with a structured bag, clean footwear, and one bold accessory to make it feel polished for a real day out.
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-[#E7B8B8] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-[#A41515]" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Style Notes</p>
                <h2 className="text-xl font-bold text-[#260909]">Editorial picks</h2>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {visibleGuides.map((guide) => (
                <button
                  key={guide.id}
                  type="button"
                  onClick={() => setSelectedGuideId(guide.id)}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    selectedGuideId === guide.id ? "border-[#820000] bg-[#FFF7F7] shadow-md" : "border-[#E7B8B8] bg-white"
                  }`}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${guide.color}`}>
                    <Palette className="h-6 w-6 text-neutral-700" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="mb-1 truncate font-bold text-[#260909]">{guide.title}</h3>
                    <p className="text-xs font-semibold text-[#735656]">{guide.readTime} read</p>
                  </div>
                </button>
              ))}
            </div>

            {selectedGuide ? (
              <div className="mt-5 rounded-2xl border border-[#E7B8B8] bg-[#FFF7F7] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7e74]">Current guide</p>
                    <h3 className="mt-1 text-lg font-bold text-[#260909]">{selectedGuide.title}</h3>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#820000]">{selectedGuide.readTime}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#735656]">
                  A quick reference for building looks that feel current, wearable, and easy to repeat.
                </p>
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-[#E7B8B8] bg-[#FFF7F7] p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="mb-2 font-bold text-[#260909]">Color Palette Generator</h3>
            <p className="mb-4 text-sm text-[#735656]">Use your live outfit suggestions to build a color story that feels intentional and wearable.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedGuideId(GUIDES[0].id);
                setSelectedTrendId(trends[0]?.id || "");
              }}
              className="w-full rounded-xl border border-[#E7B8B8] bg-white py-2.5 font-semibold text-[#820000] transition-colors hover:border-[#820000] hover:bg-[#FFECEC]"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
