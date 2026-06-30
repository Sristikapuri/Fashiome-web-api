'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { TrendingUp, Compass, Palette, BookOpen } from 'lucide-react';

const TRENDING_STYLES = [
  { id: 1, name: "Y2K Revival", searches: "125K", image: "/images/welcome/hero-editorial.jpg" },
  { id: 2, name: "Quiet Luxury", searches: "98K", image: "/images/welcome/hero-blazer.jpg" },
  { id: 3, name: "Sustainable Denim", searches: "84K", image: "/images/welcome/hero-gown.jpg" },
];

const GUIDES = [
  { id: 1, title: "Color Theory for Spring", readTime: "5 min", color: "bg-pink-100" },
  { id: 2, title: "Building a Capsule Wardrobe", readTime: "8 min", color: "bg-blue-100" },
  { id: 3, title: "Accessorizing 101", readTime: "4 min", color: "bg-violet-100" },
];

export function DiscoverTab() {
  const [search, setSearch] = useState('');
  const [selectedTrendId, setSelectedTrendId] = useState<number>(TRENDING_STYLES[0].id);
  const [selectedGuideId, setSelectedGuideId] = useState<number>(GUIDES[0].id);

  const visibleTrends = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return TRENDING_STYLES;
    return TRENDING_STYLES.filter((trend) => trend.name.toLowerCase().includes(query));
  }, [search]);

  const visibleGuides = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return GUIDES;
    return GUIDES.filter((guide) => guide.title.toLowerCase().includes(query));
  }, [search]);

  const handleSearch = () => {
    const nextTrend = visibleTrends[0];
    const nextGuide = visibleGuides[0];

    if (nextTrend) {
      setSelectedTrendId(nextTrend.id);
    }

    if (nextGuide) {
      setSelectedGuideId(nextGuide.id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Search */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#820000] to-[#A41515] p-10 overflow-hidden shadow-xl text-center">
        <div className="relative z-10">
          <Compass className="w-12 h-12 text-[#FFDADA] mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Discover New Styles</h1>
          <p className="text-[#FFDADA] mb-6 max-w-md mx-auto">Explore curated collections, trending aesthetics, and expert style guides tailored to you.</p>
          
          <div className="max-w-xl mx-auto flex gap-2">
            <input 
              type="text" 
              placeholder="Search trends, brands, or styles..." 
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="flex-1 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-white/50 text-[#260909] shadow-lg"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors shadow-lg"
            >
              Search
            </button>
          </div>
          <p className="mt-4 text-sm text-[#FFDADA]">
            Showing {visibleTrends.length} trend{visibleTrends.length === 1 ? '' : 's'} and {visibleGuides.length} guide{visibleGuides.length === 1 ? '' : 's'}.
          </p>
        </div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/20 rounded-full blur-3xl" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Trending Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-[#A41515]" />
            <h2 className="text-xl font-bold text-[#260909]">Trending Right Now</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {visibleTrends.map(trend => (
              <button
                key={trend.id}
                type="button"
                onClick={() => setSelectedTrendId(trend.id)}
                className={`group relative rounded-xl overflow-hidden aspect-[4/5] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 text-left ${
                  selectedTrendId === trend.id ? 'ring-2 ring-[#A41515] ring-offset-2 ring-offset-white' : ''
                }`}
              >
                <Image
                  src={trend.image}
                  alt={trend.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-between items-end">
                    <h3 className="font-bold text-white text-lg leading-tight">{trend.name}</h3>
                    <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded text-xs font-semibold text-white whitespace-nowrap">
                      {trend.searches} 🔥
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Guides Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[#A41515]" />
            <h2 className="text-xl font-bold text-[#260909]">Style Guides</h2>
          </div>

          <div className="space-y-4">
            {visibleGuides.map(guide => (
              <button
                key={guide.id}
                type="button"
                onClick={() => setSelectedGuideId(guide.id)}
                className={`p-5 rounded-xl flex gap-4 items-center cursor-pointer hover:shadow-md transition-shadow bg-white border text-left w-full ${
                  selectedGuideId === guide.id ? 'border-[#820000] shadow-md' : 'border-[#E7B8B8]'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${guide.color}`}>
                  <Palette className="w-6 h-6 text-neutral-700" />
                </div>
                <div>
                  <h3 className="font-bold text-[#260909] mb-1">{guide.title}</h3>
                  <p className="text-xs font-semibold text-[#735656]">{guide.readTime} read</p>
                </div>
              </button>
            ))}
          </div>

          <div className="rounded-xl bg-[#FFF7F7] p-6 border border-[#E7B8B8] text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="font-bold text-[#260909] mb-2">Color Palette Generator</h3>
            <p className="text-sm text-[#735656] mb-4">Find colors that match your skin tone perfectly.</p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedTrendId(TRENDING_STYLES[0].id);
                setSelectedGuideId(GUIDES[0].id);
              }}
              className="w-full py-2.5 bg-white text-[#820000] border border-[#E7B8B8] font-semibold rounded-lg hover:bg-[#FFECEC] hover:border-[#820000] transition-colors"
            >
              Try it out
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
