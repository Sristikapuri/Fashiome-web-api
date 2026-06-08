import Link from "next/link";
import type { ReactNode } from "react";
import { ROUTES } from "@/lib/routes";

const LOGO_CLASS =
  "font-serif text-[26px] font-bold text-[#9498C1] no-underline justify-self-start";

const FOOTER_LINK_CLASS =
  "text-[13px] font-medium text-[#6B5B4B] no-underline whitespace-nowrap transition-colors hover:text-[#D4AF37]";

const NAV_LINK =
  "text-[13px] font-medium tracking-wide text-[#6B5B4B] uppercase no-underline transition-colors hover:text-[#D4AF37]";

const NAV_LINK_ACTIVE =
  "text-[13px] font-medium tracking-wide text-[#D4AF37] uppercase underline underline-offset-4 no-underline";

const WELCOME_HERO_IMAGES = [
  {
    id: "hero-blazer",
    src: "/images/welcome/hero-blazer.jpg",
    alt: "Formal blazer outfit — office and smart-casual looks styled by FashioMe",
  },
  {
    id: "hero-gown",
    src: "/images/welcome/hero-gown.jpg",
    alt: "Evening gown — party and occasion wear from FashioMe recommendations",
  },
  {
    id: "hero-editorial",
    src: "/images/welcome/hero-editorial.jpg",
    alt: "Runway editorial fashion — AI-curated high-fashion styling on FashioMe",
  },
  {
    id: "hero-street",
    src: "/images/welcome/hero-street.jpg",
    alt: "Street-style casual outfit — everyday looks from your AI fashion stylist",
  },
];

const WELCOME_CATEGORIES = [
  {
    name: "Traditional",
    slug: "traditional",
    image: "/images/welcome/cat-traditional.jpg",
    alt: "Traditional category — ethnic and cultural attire on FashioMe",
  },
  {
    name: "Formal",
    slug: "formal",
    image: "/images/welcome/cat-formal.jpg",
    alt: "Formal category — tailored suits and professional wear on FashioMe",
  },
  {
    name: "Casual",
    slug: "casual",
    image: "/images/welcome/cat-casual.jpg",
    alt: "Casual category — relaxed street-style outfits on FashioMe",
  },
  {
    name: "Party",
    slug: "party",
    image: "/images/welcome/cat-party.jpg",
    alt: "Party category — evening and celebration dresses on FashioMe",
  },
  {
    name: "Western",
    slug: "western",
    image: "/images/welcome/cat-western.jpg",
    alt: "Western category — contemporary coats and modern western wear on FashioMe",
  },
];

type EngineFeature = {
  title: string;
  description: string;
  link: string;
  href: string;
  icon: ReactNode;
};

const ENGINE_FEATURES: EngineFeature[] = [
  {
    title: "AI Recommendations",
    description:
      "Curated outfit pairings based on your style profile, color palette, and the latest trends.",
    link: "Explore Engine",
    href: `${ROUTES.welcome}#dashboard`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2l1.8 5.5L19 9l-5.2 1.5L12 16l-1.8-5.5L5 9l5.2-1.5L12 2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Occasion-Based",
    description:
      "Wedding, office, brunch, or date night — looks tailored to what is on your calendar.",
    link: "View Occasions",
    href: `${ROUTES.welcome}#recommendations`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Personalized Fit",
    description:
      "Silhouettes and cuts chosen to flatter your frame — from casual daywear to couture.",
    link: "Set Profile",
    href: ROUTES.register,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function Welcome() {
  return (
    <div className="min-h-screen bg-welcome">
      <header className="mx-auto grid max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center bg-welcome px-8 py-5 max-[900px]:grid-cols-[1fr_auto] max-[900px]:px-5 max-[900px]:py-4">
        <Link href={ROUTES.welcome} className={LOGO_CLASS}>
          FashioMe
        </Link>
        <nav
          className="flex flex-wrap items-center justify-self-center gap-9 max-[900px]:hidden"
          aria-label="Main"
        >
          <Link href={ROUTES.welcome} className={NAV_LINK_ACTIVE} aria-current="page">
            Home
          </Link>
          <a href="#dashboard" className={NAV_LINK}>
            Dashboard
          </a>
          <a href="#recommendations" className={NAV_LINK}>
            Recommendations
          </a>
        </nav>
        <div className="justify-self-end">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D4AF37] bg-[#f5f3f1] text-[#9498C1]"
            aria-hidden="true"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
      </header>

      <div className="hidden justify-center border-b border-[#ebe6e2] bg-welcome px-5 py-3 max-[900px]:flex">
        <nav className="flex flex-wrap items-center gap-9" aria-label="Main">
          <Link href={ROUTES.welcome} className={NAV_LINK_ACTIVE} aria-current="page">
            Home
          </Link>
          <a href="#dashboard" className={NAV_LINK}>
            Dashboard
          </a>
          <a href="#recommendations" className={NAV_LINK}>
            Recommendations
          </a>
        </nav>
      </div>

      <section className="bg-welcome px-8 pb-16 pt-6 max-[600px]:px-4">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 items-center gap-10 max-[900px]:grid-cols-1">
          <div>
            <p className="mb-4 text-[11px] font-bold tracking-[0.14em] text-[#D4AF37] uppercase">
              AI-Powered Personal Styling
            </p>
            <h1 className="max-w-[480px] font-serif text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.15] font-bold text-[#9498C1]">
              Your Personal AI Fashion Stylist
            </h1>
            <p className="mt-5 max-w-[420px] text-[15px] leading-[1.7] text-[#6B5B4B]">
              Discover outfits that match your personality, occasion, and style.
              Merging global elegance with personal expression.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 max-[600px]:flex-col max-[600px]:items-stretch">
              <Link
                href={ROUTES.register}
                className="inline-flex items-center justify-center rounded-full bg-[#9498C1] px-7 py-3 text-sm font-semibold whitespace-nowrap text-white no-underline transition-colors hover:bg-[#7f83ad] max-[600px]:w-full"
              >
                Get Started
              </Link>
              <Link
                href={ROUTES.login}
                className="inline-flex items-center justify-center rounded-full border border-[#D4AF37] bg-white px-7 py-3 text-sm font-semibold whitespace-nowrap text-[#9498C1] no-underline transition-colors hover:border-[#9498C1] max-[600px]:w-full"
              >
                Login
              </Link>
              <Link
                href={ROUTES.register}
                className="px-2 py-3 text-[15px] font-semibold text-[#D4AF37] no-underline hover:underline max-[600px]:text-center"
              >
                Sign Up
              </Link>
            </div>
          </div>

          <div
            className="grid grid-cols-2 gap-3.5 max-[900px]:mx-auto max-[900px]:max-w-[420px]"
            aria-label="Sample AI-styled outfit looks"
          >
            {WELCOME_HERO_IMAGES.map((img) => (
              <img
                key={img.id}
                src={img.src}
                alt={img.alt}
                width={520}
                height={520}
                loading="eager"
                decoding="async"
                className="aspect-square w-full rounded-[20px] bg-[#f0ebe8] object-cover shadow-[0_6px_24px_rgba(74,29,29,0.08)]"
              />
            ))}
          </div>
        </div>
      </section>

      <section id="dashboard" className="bg-engine px-8 py-[72px] max-[600px]:px-4">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto mb-12 max-w-[640px] text-center">
            <h2 className="mb-3.5 font-serif text-[clamp(1.75rem,3vw,2.25rem)] font-bold text-[#9498C1]">
              Intelligent Styling Engine
            </h2>
            <p className="text-[15px] leading-[1.65] text-[#6B5B4B]">
              Your personal stylist in your pocket — blending fabrics, seasons,
              and silhouettes into looks you will actually wear.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1">
            {ENGINE_FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[20px] bg-white px-6 pt-7 pb-8 shadow-[0_4px_20px_rgba(74,29,29,0.06)]"
              >
                <div
                  className="mb-[18px] flex h-10 w-10 items-center justify-center text-[#D4AF37]"
                  aria-hidden="true"
                >
                  {feature.icon}
                </div>
                <h3 className="mb-2.5 text-[17px] font-bold text-[#9498C1]">
                  {feature.title}
                </h3>
                <p className="mb-5 text-sm leading-[1.6] text-[#6B5B4B]">
                  {feature.description}
                </p>
                <Link
                  href={feature.href}
                  className="text-sm font-semibold text-[#D4AF37] no-underline hover:underline"
                >
                  {feature.link} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="recommendations" className="bg-welcome px-8 pt-[72px] pb-20 max-[600px]:px-4">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 flex items-baseline justify-between gap-4 max-[600px]:flex-col max-[600px]:items-start">
            <h2 className="font-serif text-[clamp(1.5rem,2.5vw,2rem)] font-bold text-[#9498C1]">
              Browse by Category
            </h2>
            <a
              href="#recommendations"
              className="text-sm font-semibold whitespace-nowrap text-[#D4AF37] no-underline hover:underline"
            >
              View All Categories
            </a>
          </div>
          <div className="grid grid-cols-5 gap-4 max-[1024px]:grid-cols-3 max-[900px]:grid-cols-2 max-[600px]:gap-3">
            {WELCOME_CATEGORIES.map((cat) => (
              <article
                key={cat.slug}
                className="group relative aspect-[3/4.2] overflow-hidden rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
                aria-label={`${cat.name} category`}
              >
                <img
                  src={cat.image}
                  alt={cat.alt}
                  width={450}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full bg-[#f0ebe8] object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-linear-to-t from-[rgba(45,30,28,0.85)] via-[rgba(45,30,28,0.2)] to-transparent"
                  aria-hidden="true"
                />
                <span className="absolute bottom-3.5 left-3.5 z-1 text-[15px] font-bold tracking-[0.02em] text-white">
                  {cat.name}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#ebe6e2] bg-welcome px-8 pt-12 pb-10 max-[600px]:px-4">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-10 max-[600px]:flex-col max-[600px]:items-start">
          <div className="max-w-[380px]">
            <Link href={ROUTES.welcome} className={`${LOGO_CLASS} mb-3.5 inline-block`}>
              FashioMe
            </Link>
            <p className="text-sm leading-[1.65] text-[#6B5B4B]">
              Curating global elegance with advanced artificial intelligence for
              the modern style enthusiast.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-7 max-[600px]:gap-5">
            <nav className="flex flex-wrap gap-7 max-[600px]:gap-5" aria-label="Footer">
              <a href="#dashboard" className={FOOTER_LINK_CLASS}>
                About
              </a>
              <a href="#recommendations" className={FOOTER_LINK_CLASS}>
                Style Guide
              </a>
              <a href="#recommendations" className={FOOTER_LINK_CLASS}>
                Terms
              </a>
              <Link href={ROUTES.login} className={FOOTER_LINK_CLASS}>
                Support
              </Link>
            </nav>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#D4AF37] bg-white p-0 text-[#9498C1] transition-colors hover:border-[#9498C1]"
                aria-label="Language"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M3 12h18M12 3c2.5 3 4 6 4 9s-1.5 6-4 9M12 3c-2.5 3-4 6-4 9s1.5 6 4 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#D4AF37] bg-white p-0 text-[#9498C1] transition-colors hover:border-[#9498C1]"
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
    </div>
  );
}