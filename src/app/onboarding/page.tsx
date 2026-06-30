"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { handleCompleteOnboarding } from "@/lib/actions/onboarding-action";

const ONBOARDING_ITEMS = [
  {
    title: "Your AI Stylist,\nReimagined.",
    subtitle: "Merging the heritage of the Saree with the edge of modern tailoring.",
    imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
  },
  {
    title: "Luxury Meets\nTechnology.",
    subtitle: "Discover premium fashion recommendations powered by AI intelligence.",
    imageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
  },
  {
    title: "Create Your\nOwn Identity.",
    subtitle: "Fashion curated uniquely for your personality and culture.",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentSlide = ONBOARDING_ITEMS[currentIndex];

  const handleNext = async () => {
    setError(null);
    if (currentIndex < ONBOARDING_ITEMS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleting(true);
      // Calls completion with default preference tags
      const result = await handleCompleteOnboarding(["tailored", "minimal", "neutral"]);
      setIsCompleting(false);
      if (result.success) {
        router.push("/silhouette");
      } else {
        setError(result.message || "Failed to complete onboarding");
      }
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-page text-body font-sans">
      {/* Top Header */}
      <header className="mx-auto w-full max-w-6xl px-6 py-8">
        <h1 className="font-serif text-3xl font-bold text-primary">FashioMe</h1>
      </header>

      {/* Main Slide Content */}
      <main className="flex flex-1 items-center justify-center px-6 pb-12">
        <div className="flex w-full max-w-4xl flex-col items-center gap-10 md:flex-row md:items-stretch">
          {/* Left Side: Luxury Image Frame */}
          <div className="relative aspect-[3/4.2] w-full max-w-sm overflow-hidden rounded-3xl bg-cardBackground shadow-card shadow-body/10 md:w-1/2">
            <Image
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-all duration-700 ease-in-out"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          </div>

          {/* Right Side: Copy & Buttons */}
          <div className="flex w-full flex-col justify-between py-4 md:w-1/2">
            <div>
              {/* Tag */}
              <span className="inline-block rounded-full bg-cardBackground px-4 py-1.5 text-xs font-semibold tracking-widest text-primary uppercase">
                Personalized Style
              </span>

              {/* Title */}
              <h2 className="mt-6 font-serif text-3xl font-black leading-tight text-heading md:text-4xl whitespace-pre-line">
                {currentSlide.title}
              </h2>

              {/* Subtitle */}
              <p className="mt-4 text-base leading-relaxed text-muted">
                {currentSlide.subtitle}
              </p>
            </div>

            {/* Bottom Section */}
            <div className="mt-12 flex flex-col gap-6">
              {error && (
                <p className="text-sm font-medium text-primary">
                  {error}
                </p>
              )}

              {/* Dots Progress Indicator */}
              <div className="flex gap-2">
                {ONBOARDING_ITEMS.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === index ? "w-8 bg-primary" : "w-2 bg-divider"
                    }`}
                  />
                ))}
              </div>

              {/* Nav Buttons */}
              <div className="flex gap-3">
                {currentIndex > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex-1 cursor-pointer rounded-full border border-divider bg-transparent py-4 text-sm font-bold text-heading transition-all hover:bg-cardBackground"
                  >
                    BACK
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={isCompleting}
                  className="flex-[2] cursor-pointer rounded-full bg-primary py-4 text-sm font-bold text-white transition-all hover:bg-primary-dark disabled:opacity-50"
                >
                  {isCompleting ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : currentIndex === ONBOARDING_ITEMS.length - 1 ? (
                    "GET STARTED"
                  ) : (
                    "NEXT"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
