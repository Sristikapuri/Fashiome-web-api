'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Plus, Filter, Heart, MoreVertical, Search, Upload, X, Check } from 'lucide-react';
import {
  handleGetWardrobe,
  handleUpdateWardrobeItem,
  handleUploadWardrobePhoto,
} from '@/lib/actions/home-action';

interface WardrobeItem {
  id: string;
  name?: string;
  title?: string;
  category: string;
  color?: string;
  imageUrl?: string;
  image?: string;
  isFavorite?: boolean;
  favorite?: boolean;
}

const WARDROBE_CATEGORIES = [
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Shirts',
  'Sweaters',
  'Pants',
  'Skirts',
  'Activewear',
];

function normalizeImageSrc(src?: string) {
  if (!src) return "/images/welcome/hero-gown.jpg";
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
    return assetMap[name] || "/images/welcome/hero-gown.jpg";
  }
  if (src.startsWith("/")) {
    return src;
  }
  return `/${src}`;
}

export function WardrobeTab() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', ...WARDROBE_CATEGORIES];
  const [search, setSearch] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [itemTitle, setItemTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadWardrobe = async () => {
      try {
        const res = await handleGetWardrobe();
        if (!cancelled && res.success && res.data) {
          setItems(res.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadWardrobe();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleFavorite = async (id: string, currentFav: boolean) => {
    try {
      const updated = await handleUpdateWardrobeItem(id, { isFavorite: !currentFav });
      if (updated.success) {
        setItems((prev) => prev.map(it => it.id === id ? { ...it, isFavorite: !currentFav } : it));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setItemTitle(file.name.replace(/\.[^.]+$/, ''));
    setSelectedCategory('');
    setUploadMessage(null);
    setShowUploadModal(true);

    // Reset file input so same file can be re-selected
    event.target.value = '';
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedCategory('');
    setItemTitle('');
  };

  const handleSaveToWardrobe = async () => {
    if (!selectedFile || !selectedCategory) return;

    setUploading(true);
    setUploadMessage(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const result = await handleUploadWardrobePhoto(
        formData,
        selectedCategory,
        itemTitle || 'My Item'
      );

      if (result.success) {
        setUploadMessage('Item added to your wardrobe!');
        // Refresh wardrobe items so the new item appears
        const refreshed = await handleGetWardrobe();
        if (refreshed.success && refreshed.data) {
          setItems(refreshed.data);
        }
        // Close modal after a brief delay
        setTimeout(() => {
          handleCloseModal();
          setUploadMessage(null);
        }, 1200);
      } else {
        setUploadMessage(result.message || 'Failed to save. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setUploadMessage('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (activeCategory !== 'All' && item.category !== activeCategory) return false;
    if (favoritesOnly && !(item.isFavorite || item.favorite)) return false;
    if (search && !(item.title || item.name || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Controls */}
      <div className="relative flex flex-col md:flex-row justify-between gap-4 items-start md:items-center bg-white p-4 rounded-xl border border-[#E7B8B8] shadow-sm">
        <div className="flex-1 w-full relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#735656]" />
          <input 
            type="text" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search your wardrobe..." 
            className="w-full bg-[#FFF7F7] border-none rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#820000]/20 text-[#260909]"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setFiltersOpen((current) => !current)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFF7F7] text-[#820000] font-semibold border border-[#E7B8B8] rounded-lg hover:bg-[#FFECEC] transition-colors"
          >
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button
            type="button"
            onClick={handleUploadClick}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#820000] text-white font-semibold rounded-lg hover:bg-[#A41515] transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        {filtersOpen && (
          <div className="absolute right-4 top-[calc(100%-0.25rem)] z-20 w-56 rounded-xl border border-[#E7B8B8] bg-white p-3 shadow-lg">
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All');
                setFavoritesOnly(false);
                setSearch('');
                setFiltersOpen(false);
              }}
              className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#260909] hover:bg-[#FFF7F7]"
            >
              Show all items
            </button>
            <button
              type="button"
              onClick={() => {
                setFavoritesOnly(true);
                setFiltersOpen(false);
              }}
              className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#260909] hover:bg-[#FFF7F7]"
            >
              Favorites only
            </button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeCategory === cat 
                ? 'bg-[#820000] text-white shadow-md' 
                : 'bg-white border border-[#E7B8B8] text-[#735656] hover:border-[#820000] hover:text-[#820000]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* Upload Card */}
        <button
          type="button"
          onClick={handleUploadClick}
          className="group cursor-pointer rounded-xl border-2 border-dashed border-[#E7B8B8] bg-[#FFF7F7]/50 flex flex-col items-center justify-center gap-3 h-[300px] hover:border-[#820000] hover:bg-[#FFECEC] transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform text-[#820000]">
            <Upload className="w-6 h-6" />
          </div>
          <span className="font-semibold text-[#820000]">Upload New</span>
          <span className="text-xs text-[#735656] px-4 text-center">Take a photo of your clothes to add them</span>
        </button>

        {/* Item Cards */}
        {loading ? (
          <div className="col-span-full py-10 text-center text-[#735656]">Loading your wardrobe...</div>
        ) : (
              filteredItems.map((item) => (
            <div key={item.id} className="group bg-white rounded-xl border border-[#E7B8B8] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#FFF7F7]">
                <Image
                  src={
                    (item.imageUrl || item.image)?.startsWith('/')
                      ? `http://localhost:8089${item.imageUrl || item.image}`
                      : normalizeImageSrc(item.imageUrl || item.image)
                  }
                  alt={item.title || item.name || 'Wardrobe item'}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button 
                  onClick={() => toggleFavorite(item.id, !!(item.isFavorite || item.favorite))}
                  className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-[#820000] hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Heart className={`w-4 h-4 ${(item.isFavorite || item.favorite) ? 'fill-current' : ''}`} />
                </button>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-[#260909] truncate">{item.title || item.name}</h3>
                  <button
                    type="button"
                    onClick={() => setOpenMenuId((current) => (current === item.id ? null : item.id))}
                    className="text-[#735656] hover:text-[#820000] -mr-1"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-[#735656]">{item.category} {item.color && `• ${item.color}`}</p>
                {openMenuId === item.id && (
                  <div className="mt-3 rounded-lg border border-[#E7B8B8] bg-[#FFF7F7] p-2 text-xs font-semibold text-[#260909]">
                    <button
                      type="button"
                      onClick={() => {
                        void toggleFavorite(item.id, !!(item.isFavorite || item.favorite));
                        setOpenMenuId(null);
                      }}
                      className="block w-full rounded-md px-3 py-2 text-left hover:bg-white"
                    >
                      Toggle favorite
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(item.title || item.name || 'Wardrobe item');
                        setOpenMenuId(null);
                      }}
                      className="mt-1 block w-full rounded-md px-3 py-2 text-left hover:bg-white"
                    >
                      Copy item name
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

      </div>

      {/* ===== Upload Modal ===== */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7B8B8]">
              <h2 className="text-lg font-bold text-[#260909]">Add to Wardrobe</h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 rounded-full hover:bg-[#FFF7F7] text-[#735656] hover:text-[#820000] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              
              {/* Image Preview */}
              {previewUrl && (
                <div className="relative w-full h-52 rounded-xl overflow-hidden bg-[#FFF7F7] border border-[#E7B8B8]">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              {/* Title Input */}
              <div>
                <label className="block text-sm font-semibold text-[#260909] mb-1.5">
                  Item Name
                </label>
                <input
                  type="text"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  placeholder="e.g. Blue Denim Jacket"
                  className="w-full bg-[#FFF7F7] border border-[#E7B8B8] rounded-lg px-4 py-2.5 text-[#260909] focus:outline-none focus:ring-2 focus:ring-[#820000]/20 focus:border-[#820000] transition-colors"
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-[#260909] mb-2">
                  Select Category <span className="text-[#820000]">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {WARDROBE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`relative flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        selectedCategory === cat
                          ? 'bg-[#820000] text-white shadow-md ring-2 ring-[#820000]/30'
                          : 'bg-[#FFF7F7] text-[#735656] border border-[#E7B8B8] hover:border-[#820000] hover:text-[#820000] hover:bg-[#FFECEC]'
                      }`}
                    >
                      {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Message */}
              {uploadMessage && (
                <div className={`rounded-lg px-4 py-2.5 text-sm font-medium ${
                  uploadMessage.includes('added') || uploadMessage.includes('success')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {uploadMessage}
                </div>
              )}

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSaveToWardrobe}
                disabled={!selectedCategory || uploading}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 ${
                  selectedCategory && !uploading
                    ? 'bg-[#820000] text-white hover:bg-[#A41515] shadow-lg hover:shadow-xl'
                    : 'bg-[#E7B8B8] text-white cursor-not-allowed'
                }`}
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Save to Wardrobe
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
