"use client";

import { useState } from "react";

export function HomeFooterActions() {
  const [language, setLanguage] = useState("EN");

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "FashioMe", url });
        return;
      } catch {
        
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => setLanguage((current) => (current === "EN" ? "NP" : "EN"))}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#A41515] bg-white p-0 text-[#820000] transition-colors hover:border-[#820000]"
        aria-label="Language"
      >
        <span className="text-[10px] font-bold tracking-[0.18em]">{language}</span>
      </button>
      <button
        type="button"
        onClick={handleShare}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#A41515] bg-white p-0 text-[#820000] transition-colors hover:border-[#820000]"
        aria-label="Share"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="18" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="18" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8.5 11l7-4M8.5 13l7 4"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </button>
    </div>
  );
}
