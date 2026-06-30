"use client";

import { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [language, setLanguage] = useState("EN");

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "https://fashiome.app";
    if (navigator.share) {
      try {
        await navigator.share({ title: "FashioMe", url });
        return;
      } catch {
        // fall back to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <footer className="border-t border-[#E7B8B8] bg-[#FFF7F7] px-8 pt-12 pb-10 max-[600px]:px-4">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-10 max-[600px]:flex-col max-[600px]:items-start">
        <div className="max-w-[380px]">
          <Link href="/" className="font-serif text-[1.15rem] font-bold text-[#820000] no-underline mb-3.5 inline-block">
            FashioMe
          </Link>
          <p className="text-sm leading-[1.65] text-[#735656]">
            Curating global elegance with advanced artificial intelligence for
            the modern style enthusiast.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-7 max-[600px]:gap-5">
          <nav className="flex flex-wrap gap-7 max-[600px]:gap-5" aria-label="Footer">
            <a href="#dashboard" className="text-[13px] font-medium text-[#735656] no-underline whitespace-nowrap transition-colors hover:text-[#A41515]">
              About
            </a>
            <a href="#recommendations" className="text-[13px] font-medium text-[#735656] no-underline whitespace-nowrap transition-colors hover:text-[#A41515]">
              Style Guide
            </a>
            <a href="#recommendations" className="text-[13px] font-medium text-[#735656] no-underline whitespace-nowrap transition-colors hover:text-[#A41515]">
              Terms
            </a>
            <Link href="/login" className="text-[13px] font-medium text-[#735656] no-underline whitespace-nowrap transition-colors hover:text-[#A41515]">
              Support
            </Link>
          </nav>
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
        </div>
      </div>
    </footer>
  );
}
