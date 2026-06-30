'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Send, Image as ImageIcon, Sparkles, Shirt, ShoppingBag } from 'lucide-react';
import { handleGenerateOutfit, handleGenerateProfileFromImage, handleSendAssistantChat } from '@/lib/actions/home-action';
import { handleGetCart, handleSetCart } from '@/lib/actions/cart-action';
import { formatMoney } from '@/lib/pricing';
import { ROUTES } from '@/lib/routes';

interface Message {
  id: number;
  role: 'assistant' | 'user';
  text: string;
  imageUrl?: string;
  outfit?: any;
}

type MatchedProduct = {
  _id: string;
  name: string;
  category: string;
  size: string;
  color: string;
  price: number;
  discountedPrice?: number | null;
  stock: number;
  imageUrl?: string;
  description?: string;
  matchReason?: string;
};

function normalizeImageSrc(src?: string) {
  if (!src) return "";
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
    return assetMap[name] || "";
  }
  if (src.startsWith("/")) {
    return src;
  }
  return `/${src}`;
}

export function AiStylistTab({ profileData }: { profileData?: any }) {
  const router = useRouter();
  const [aiProfile, setAiProfile] = useState(profileData || {});
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'assistant', text: 'Hello! I am your AI Stylist. What are we dressing up for today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGen, setLoadingGen] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [bagMessage, setBagMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Generator state
  const [occasion, setOccasion] = useState('Casual Outing');
  const [weather, setWeather] = useState('Summer / Hot');
  const [vibe, setVibe] = useState('Minimalist');

  useEffect(() => {
    setAiProfile(profileData || {});
  }, [profileData]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: input }]);
    const currentInput = input;
    setInput('');
    setLoading(true);
    
    try {
      const response = await handleSendAssistantChat({
        message: currentInput,
        profileData: aiProfile
      });
      
      if (response.success && response.data) {
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          role: 'assistant', 
          text: response.data.reply,
          outfit: response.data.recommendation
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: 'assistant',
          text: response.message || 'Sorry, I could not get a response from the AI stylist right now.'
        }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', text: 'Sorry, I am having trouble connecting to the styling engine right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (loadingGen) return;
    setLoadingGen(true);
    try {
      const response = await handleGenerateOutfit({
        occasion: `${occasion} in ${weather} with a ${vibe} vibe`,
        profileData: aiProfile
      });
      
      if (response.success && response.data) {
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          role: 'assistant', 
          text: `Here is a custom ${vibe} outfit I generated for your ${occasion} in ${weather} weather!`,
          outfit: response.data
        }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', text: 'Failed to generate a custom outfit.' }]);
    } finally {
      setLoadingGen(false);
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: 'user',
        text: `Uploaded image: ${file.name}`,
        imageUrl: previewUrl,
      },
    ]);

    setAnalyzingImage(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const result = await handleGenerateProfileFromImage({
        imageFormData: formData,
        profileData: aiProfile,
        occasion,
        source: 'Uploaded Portrait',
      });

      if (result.success && result.data) {
        const nextProfile = result.data.profileData || aiProfile;
        setAiProfile(nextProfile);

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: 'assistant',
            text:
              result.data.summary ||
              'I analyzed your uploaded image and updated your style profile for more accurate recommendations.',
            outfit: result.data.recommendation,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: 'assistant',
            text: result.message || 'I could not analyze that image right now.',
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: 'I could not analyze that image right now.',
        },
      ]);
    } finally {
      setAnalyzingImage(false);
    }

    event.target.value = '';
  };

  const addMatchedProductToBag = async (product: MatchedProduct) => {
    setAddingProductId(product._id);
    setBagMessage(null);

    try {
      const cartResult = await handleGetCart();
      const currentItems = Array.isArray(cartResult.data?.items) ? cartResult.data.items : [];

      const existingItem = currentItems.find((item: { clotheId: string; quantity: number }) => item.clotheId === product._id);
      const nextItems = existingItem
        ? currentItems.map((item: { clotheId: string; quantity: number }) =>
            item.clotheId === product._id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...currentItems, { clotheId: product._id, quantity: 1 }];

      const result = await handleSetCart(nextItems);

      if (!result.success) {
        setBagMessage(result.message || 'Could not add that item to your bag.');
        return;
      }

      setBagMessage(`${product.name} was added to your bag.`);
    } catch (error) {
      console.error(error);
      setBagMessage('Could not add that item to your bag.');
    } finally {
      setAddingProductId(null);
    }
  };

  const openMatchedProductsInShop = (products: MatchedProduct[], focusProductId?: string) => {
    if (!products.length) return;

    const params = new URLSearchParams();
    params.set("tab", "shop");
    params.set("shopItems", products.map((product) => product._id).join(","));

    if (focusProductId) {
      params.set("shopFocus", focusProductId);
    }

    const primaryCategory = products[0]?.category;
    if (primaryCategory) {
      params.set("shopCategory", primaryCategory);
    }

    router.push(`${ROUTES.dashboard}?${params.toString()}`);
  };

  const renderMatchedProducts = (products?: MatchedProduct[]) => {
    if (!products?.length) return null;

    return (
      <div className="mt-4 border-t border-[#E7B8B8] pt-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#820000]">
            <ShoppingBag className="h-4 w-4" />
            <p className="text-xs font-bold uppercase tracking-[0.16em]">Shop this look</p>
          </div>
          <button
            type="button"
            onClick={() => openMatchedProductsInShop(products)}
            className="rounded-full border border-[#E7B8B8] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#820000] transition hover:bg-[#FFF7F7]"
          >
            Open in Shop
          </button>
        </div>
        <div className="space-y-3">
          {products.map((product) => {
            const productImage = product.imageUrl?.startsWith('/')
              ? `http://localhost:8089${product.imageUrl}`
              : normalizeImageSrc(product.imageUrl);
            const displayPrice = product.discountedPrice ?? product.price;

            return (
              <div key={product._id} className="rounded-lg border border-[#E7B8B8] bg-[#FFF7F7] p-3">
                <div className="flex gap-3">
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-white shrink-0">
                    {productImage ? (
                      <Image
                        src={productImage}
                        alt={product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] font-semibold text-[#9A7E74]">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="truncate font-bold text-[#260909]">{product.name}</h5>
                        <p className="text-[11px] text-[#735656]">
                          {product.category} • {product.color} • {product.size}
                        </p>
                      </div>
                      <div className="text-right">
                        {product.discountedPrice !== null && product.discountedPrice !== undefined ? (
                          <>
                            <p className="text-[11px] text-[#9A7E74] line-through">{formatMoney(product.price)}</p>
                            <p className="font-bold text-[#820000]">{formatMoney(displayPrice)}</p>
                          </>
                        ) : (
                          <p className="font-bold text-[#820000]">{formatMoney(displayPrice)}</p>
                        )}
                      </div>
                    </div>
                    {product.matchReason && (
                      <p className="mt-2 text-[11px] text-[#735656]">{product.matchReason}</p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => addMatchedProductToBag(product)}
                        disabled={addingProductId === product._id}
                        className="inline-flex items-center gap-2 rounded-full bg-[#820000] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#A41515] disabled:opacity-60"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        {addingProductId === product._id ? 'Adding...' : 'Add to bag'}
                      </button>
                      <button
                        type="button"
                        onClick={() => openMatchedProductsInShop(products, product._id)}
                        className="inline-flex items-center gap-2 rounded-full border border-[#E7B8B8] bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#820000] transition hover:bg-[#FFF7F7]"
                      >
                        View in Shop
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-[800px] flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Chat Area */}
      <div className="flex-1 rounded-xl border border-[#E7B8B8] bg-white shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[#E7B8B8] bg-[#FFF7F7] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-[#820000]">FashioMe Stylist</h2>
            <p className="text-xs text-[#735656]">{loading ? 'Typing...' : 'Online & Ready to style'}</p>
          </div>
        </div>

        {Object.keys(aiProfile || {}).length > 0 && (
          <div className="border-b border-[#E7B8B8] bg-white px-4 py-3 text-xs text-[#735656]">
            Styling with your saved profile
            {aiProfile.bodyType ? ` • ${aiProfile.bodyType}` : ''}
            {aiProfile.faceShape ? ` • ${aiProfile.faceShape} face shape` : ''}
            {aiProfile.skinTone ? ` • ${aiProfile.skinTone} tone` : ''}
            {aiProfile.weight ? ` • ${aiProfile.weight} kg` : ''}
          </div>
        )}

        {bagMessage && (
          <div className="border-b border-[#E7B8B8] bg-[#FFF7F7] px-4 py-3 text-xs font-medium text-[#820000]">
            {bagMessage}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#820000] text-white rounded-tr-sm' 
                  : 'bg-[#FFF7F7] border border-[#E7B8B8] text-[#260909] rounded-tl-sm'
              }`}>
                <p>{msg.text}</p>
                {msg.outfit && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-[#E7B8B8] bg-white text-sm">
                    {msg.outfit.imageUrl && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={
                            msg.outfit.imageUrl.startsWith('/')
                              ? `http://localhost:8089${msg.outfit.imageUrl}`
                              : normalizeImageSrc(msg.outfit.imageUrl)
                          }
                          alt={msg.outfit.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-3">
                      <h4 className="font-bold text-[#820000]">{msg.outfit.title}</h4>
                      <p className="text-[#735656] mt-1 text-xs">{msg.outfit.explanation}</p>
                      {(msg.outfit.wardrobeItemsUsed?.length || msg.outfit.missingItemsToBuy?.length) && (
                        <div className="mt-3 grid gap-2 text-[11px] text-[#735656]">
                          {msg.outfit.wardrobeItemsUsed?.length ? (
                            <div className="rounded-md bg-[#FFF7F7] px-2 py-1.5">
                              <span className="font-bold text-[#820000]">Use from wardrobe:</span> {msg.outfit.wardrobeItemsUsed.join(", ")}
                            </div>
                          ) : null}
                          {msg.outfit.missingItemsToBuy?.length ? (
                            <div className="rounded-md bg-[#FFF7F7] px-2 py-1.5">
                              <span className="font-bold text-[#820000]">Buy from shop:</span> {msg.outfit.missingItemsToBuy.join(", ")}
                            </div>
                          ) : null}
                        </div>
                      )}
                      {renderMatchedProducts(msg.outfit.matchedProducts)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-2xl px-5 py-3 shadow-sm bg-[#FFF7F7] border border-[#E7B8B8] text-[#260909] rounded-tl-sm animate-pulse">
                Thinking...
              </div>
            </div>
          )}
          {analyzingImage && (
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-2xl px-5 py-3 shadow-sm bg-[#FFF7F7] border border-[#E7B8B8] text-[#260909] rounded-tl-sm animate-pulse">
                Analyzing your uploaded image and refreshing your style profile...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-[#E7B8B8]">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelected}
            />
            <button
              type="button"
              onClick={handleImageUploadClick}
              className="p-3 text-[#A41515] hover:bg-[#FFF7F7] rounded-xl transition-colors border border-transparent hover:border-[#E7B8B8]"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="E.g., I have a beach wedding next week..."
              className="flex-1 bg-[#FFF7F7] border border-[#E7B8B8] rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#820000]/20 focus:border-[#820000] transition-all text-[#260909] disabled:opacity-50"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="p-3 bg-[#820000] text-white rounded-xl hover:bg-[#A41515] transition-colors shadow-md disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Outfit Generator Sidebar */}
      <div className="w-[350px] rounded-xl border border-[#E7B8B8] bg-white p-6 shadow-sm flex flex-col gap-6 overflow-y-auto">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shirt className="w-5 h-5 text-[#820000]" />
            <h3 className="font-bold text-lg text-[#260909]">Custom Generator</h3>
          </div>
          <p className="text-sm text-[#735656]">Quickly generate outfit ideas based on specific parameters.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#735656] mb-1">Occasion</label>
            <select 
              value={occasion}
              onChange={e => setOccasion(e.target.value)}
              className="w-full bg-[#FFF7F7] border border-[#E7B8B8] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#820000]"
            >
              <option>Casual Outing</option>
              <option>Formal Event</option>
              <option>Office/Work</option>
              <option>Date Night</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-[#735656] mb-1">Weather/Season</label>
            <select 
              value={weather}
              onChange={e => setWeather(e.target.value)}
              className="w-full bg-[#FFF7F7] border border-[#E7B8B8] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#820000]"
            >
              <option>Summer / Hot</option>
              <option>Winter / Cold</option>
              <option>Spring / Mild</option>
              <option>Autumn / Breezy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#735656] mb-1">Vibe</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Minimalist', 'Streetwear', 'Vintage', 'Chic', 'Edgy'].map(v => (
                <span 
                  key={v} 
                  onClick={() => setVibe(v)}
                  className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                    vibe === v 
                      ? 'bg-[#820000] text-white border border-[#820000]' 
                      : 'bg-[#FFF7F7] border border-[#E7B8B8] text-[#735656] hover:bg-[#820000]/10 hover:border-[#820000]'
                  }`}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loadingGen}
          className="w-full mt-auto py-3 bg-[#820000] text-white font-bold rounded-xl hover:bg-[#A41515] transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          {loadingGen ? 'Generating...' : 'Generate Outfit'}
        </button>
      </div>

    </div>
  );
}
