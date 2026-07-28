'use client';

import { useState, useEffect, useMemo } from 'react';
import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Home, Sparkles, Shirt, Compass, User, Crown, Package } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { HomeTab } from './_components/HomeTab';
import { AiStylistTab } from './_components/AiStylistTab';
import { WardrobeTab } from './_components/WardrobeTab';
import { DiscoverTab } from './_components/DiscoverTab';
import { ProfileTab } from './_components/ProfileTab';
import { ShopTab } from './_components/ShopTab';
import MyOrdersTab from './_components/MyOrdersTab';
import { handleGetDashboardData } from "@/lib/actions/home-action";
import { handleGetSilhouetteProfile } from "@/lib/actions/silhouette-action";

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'ai-stylist', label: 'AI Stylist', icon: Sparkles },
  { id: 'wardrobe', label: 'Wardrobe', icon: Shirt },
  { id: 'shop', label: 'Shop', icon: Crown },
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [silhouetteProfile, setSilhouetteProfile] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(ROUTES.login);
      return;
    }

    let active = true;

    const loadData = async () => {
      try {
        const [dashboardRes, silhouetteRes] = await Promise.all([
          handleGetDashboardData(),
          handleGetSilhouetteProfile(),
        ]);

        if (!active) return;

        if (dashboardRes.success && dashboardRes.data) {
          setDashboardData(dashboardRes.data);
        } else {
          setDashboardError(dashboardRes.message || "Failed to load live style recommendations.");
        }

        if (silhouetteRes.success && silhouetteRes.data) {
          setSilhouetteProfile(silhouetteRes.data);
        }
      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        if (active) setDashboardLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [isAuthenticated, router]);

  const isAdmin = user?.role === "admin";
  const queryTab = searchParams.get("tab");
  const activeTab = TABS.some((tab) => tab.id === queryTab) ? queryTab! : "home";
  const profileData = useMemo(() => ({
    displayName: [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim(),
    gender: user?.gender,
    ...silhouetteProfile,
  }), [silhouetteProfile, user?.firstName, user?.gender, user?.lastName]);

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-[#FFF7F7] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#820000] border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  const navigateToTab = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);

    if (tabId !== "shop") {
      params.delete("shopItems");
      params.delete("shopFocus");
      params.delete("shopCategory");
      params.delete("shopSearch");
    }

    router.replace(`${ROUTES.dashboard}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-[#FFF7F7] text-[#260909] flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-[#E7B8B8] flex flex-col sticky top-0 md:h-screen z-10 shadow-sm md:shadow-none">
        <div className="p-6 flex items-center gap-2 border-b border-[#E7B8B8]">
          <Crown className="w-8 h-8 text-[#820000]" />
          <span className="font-serif text-2xl font-bold text-[#820000]">FashioMe</span>
        </div>
        
        <nav className="flex-1 p-4 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-2 no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigateToTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#820000] text-white shadow-md'
                  : 'text-[#735656] hover:bg-[#FFF7F7] hover:text-[#820000]'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-[#735656] group-hover:text-[#820000]'}`} />
              <span className="hidden md:block">{tab.label}</span>
            </button>
          ))}
        </nav>

        {isAdmin && (
          <div className="p-4 border-t border-[#E7B8B8]">
            <Link 
              href={ROUTES.admin} 
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#FFF7F7] text-[#820000] font-bold rounded-xl border border-[#E7B8B8] hover:bg-[#FFECEC] transition-colors"
            >
              Admin Panel
            </Link>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-hidden">
        {activeTab === 'home' && <HomeTab user={user} dashboardData={dashboardData} dashboardError={dashboardError} dashboardLoading={dashboardLoading} />}
        {activeTab === 'ai-stylist' && <AiStylistTab profileData={profileData} />}
        {activeTab === 'wardrobe' && <WardrobeTab />}
        {activeTab === 'shop' && <ShopTab />}
        {activeTab === 'discover' && <DiscoverTab profileData={profileData} />}
        {activeTab === 'orders' && <MyOrdersTab />}
        {activeTab === 'profile' && <ProfileTab user={user} />}
      </main>

    </div>
  );
}
