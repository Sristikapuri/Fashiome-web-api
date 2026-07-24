import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ROUTES } from "@/lib/routes";
import { HomeFooterActions } from "./_components/HomeFooterActions";

const LOGO_CLASS =
  "font-serif text-[26px] font-bold text-[#820000] no-underline justify-self-start";

const FOOTER_LINK_CLASS =
  "text-[13px] font-medium text-[#735656] no-underline whitespace-nowrap transition-colors hover:text-[#A41515]";

const NAV_LINK =
  "text-[13px] font-medium tracking-wide text-[#735656] uppercase no-underline transition-colors hover:text-[#A41515]";

const NAV_LINK_ACTIVE =
  "text-[13px] font-medium tracking-wide text-[#A41515] uppercase underline underline-offset-4";

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
    name: "Party & Glam",
    slug: "party",
    image: "/images/welcome/cat-party.jpg",
    alt: "Party & Glam category — sequin dresses and glitter outfits on FashioMe",
    href: ROUTES.register,
  },
  {
    name: "Gowns",
    slug: "gown",
    image: "/images/welcome/cat-formal.jpg",
    alt: "Gowns category — floor-length ball gowns and evening gowns on FashioMe",
    href: ROUTES.register,
  },
  {
    name: "Streetwear",
    slug: "streetwear",
    image: "/images/welcome/cat-casual.jpg",
    alt: "Streetwear category — urban street-style and floral dresses on FashioMe",
    href: ROUTES.register,
  },
  {
    name: "Formal Wear",
    slug: "formal-wear",
    image: "/images/welcome/cat-western.jpg",
    alt: "Formal Wear category — blazers, coats and tailored suits on FashioMe",
    href: ROUTES.register,
  },
  {
    name: "Traditional",
    slug: "traditional",
    image: "/images/welcome/cat-traditional.jpg",
    alt: "Traditional category — ethnic and cultural attire on FashioMe",
    href: ROUTES.register,
  },
];

const HERO_STATS = [
  { value: "5+", label: "signature style lanes" },
  { value: "24/7", label: "AI styling access" },
  { value: "1 tap", label: "to start your profile" },
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
    href: `/#dashboard`,
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
    href: `/#recommendations`,
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
      <header className="mx-auto grid max-w-[1200px] grid-cols-[auto_1fr_auto] items-center gap-6 bg-welcome px-8 py-5 max-[900px]:grid-cols-[1fr] max-[900px]:px-5 max-[900px]:py-4">
        <Link href="/" className={LOGO_CLASS}>
          FashioMe
        </Link>
        <nav
          className="flex flex-wrap items-center justify-center gap-9 max-[900px]:hidden"
          aria-label="Main"
        >
          <Link href="/" className={NAV_LINK_ACTIVE} aria-current="page">
            Home
          </Link>
          <a href="#dashboard" className={NAV_LINK}>
            Dashboard
          </a>
          <a href="#recommendations" className={NAV_LINK}>
            Recommendations
          </a>
        </nav>
        <div className="flex items-center justify-self-end gap-3 max-[900px]:hidden">
          <Link
            href={ROUTES.login}
            className="inline-flex items-center justify-center rounded-full border border-[#A41515] bg-white px-5 py-2.5 text-sm font-semibold text-[#820000] no-underline transition-colors hover:border-[#820000]"
          >
            Login
          </Link>
          <Link
            href={ROUTES.register}
            className="inline-flex items-center justify-center rounded-full bg-[#820000] px-5 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#5F0000]"
          >
            Get Started
          </Link>
        </div>
      </header>

      <div className="hidden border-y border-[#E7B8B8] bg-welcome px-5 py-3 max-[900px]:flex max-[900px]:justify-center">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3">
          <nav className="flex flex-wrap items-center justify-center gap-6" aria-label="Main">
            <Link href="/" className={NAV_LINK_ACTIVE} aria-current="page">
              Home
            </Link>
            <a href="#dashboard" className={NAV_LINK}>
              Dashboard
            </a>
            <a href="#recommendations" className={NAV_LINK}>
              Recommendations
            </a>
          </nav>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={ROUTES.login}
              className="inline-flex min-w-[128px] items-center justify-center rounded-full border border-[#A41515] bg-white px-5 py-2.5 text-sm font-semibold text-[#820000] no-underline transition-colors hover:border-[#820000]"
            >
              Login
            </Link>
            <Link
              href={ROUTES.register}
              className="inline-flex min-w-[128px] items-center justify-center rounded-full bg-[#820000] px-5 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#5F0000]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      <section className="bg-welcome px-8 pb-16 pt-8 max-[600px]:px-4">
        <div className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-center gap-12 max-[980px]:grid-cols-1">
          <div className="max-w-[560px]">
            <span className="inline-flex rounded-full border border-[#E7B8B8] bg-[#FFF3F3] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#A41515]">
              AI-powered personal styling
            </span>
            <h1 className="mt-5 font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] font-bold text-[#820000]">
              Style planning that feels polished, personal, and effortless.
            </h1>
            <p className="mt-5 max-w-[520px] text-[16px] leading-[1.8] text-[#735656]">
              Build your wardrobe profile, browse curated looks, and get outfit ideas
              matched to your mood, occasion, and silhouette.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 max-[600px]:flex-col max-[600px]:items-stretch">
              <Link
                href={ROUTES.register}
                className="inline-flex items-center justify-center rounded-full bg-[#820000] px-7 py-3 text-sm font-semibold whitespace-nowrap text-white no-underline transition-colors hover:bg-[#5F0000] max-[600px]:w-full"
              >
                Create Your Style Profile
              </Link>
              <Link
                href={ROUTES.login}
                className="inline-flex items-center justify-center rounded-full border border-[#A41515] bg-white px-7 py-3 text-sm font-semibold whitespace-nowrap text-[#820000] no-underline transition-colors hover:border-[#820000] max-[600px]:w-full"
              >
                Login
              </Link>
              <a
                href="#recommendations"
                className="inline-flex items-center justify-center px-2 py-3 text-[15px] font-semibold text-[#A41515] no-underline transition-colors hover:text-[#820000] max-[600px]:text-center"
              >
                Browse Categories
              </a>
            </div>
            <div className="mt-9 grid grid-cols-3 gap-3 max-[600px]:grid-cols-1">
              {HERO_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#E7B8B8] bg-[#FFF8F8] px-4 py-4 shadow-[0_6px_18px_rgba(74,29,29,0.04)]"
                >
                  <p className="text-lg font-bold text-[#820000]">{stat.value}</p>
                  <p className="mt-1 text-sm leading-6 text-[#735656]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-[980px]:mx-auto max-[980px]:max-w-[520px]">
            {WELCOME_HERO_IMAGES.map((img, index) => (
              <div
                key={img.id}
                className={`overflow-hidden rounded-[24px] bg-[#FFECEC] shadow-[0_14px_40px_rgba(74,29,29,0.12)] ${
                  index === 1 || index === 2 ? "translate-y-6 max-[980px]:translate-y-0" : ""
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={520}
                  height={520}
                  priority={index < 2}
                  className="aspect-[0.92] w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="dashboard" className="bg-engine px-8 py-[72px] max-[600px]:px-4">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto mb-12 max-w-[680px] text-center">
            <h2 className="mb-3.5 font-serif text-[clamp(1.75rem,3vw,2.25rem)] font-bold text-[#820000]">
              Intelligent Styling Engine
            </h2>
            <p className="text-[15px] leading-[1.65] text-[#735656]">
              A cleaner path from inspiration to outfit planning, with focused
              recommendations that feel like they were curated just for you.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1">
            {ENGINE_FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[24px] border border-[#E7B8B8] bg-white px-6 pb-8 pt-7 shadow-[0_10px_28px_rgba(74,29,29,0.06)]"
              >
                <div
                  className="mb-[18px] flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF3F3] text-[#A41515]"
                  aria-hidden="true"
                >
                  {feature.icon}
                </div>
                <h3 className="mb-2.5 text-[17px] font-bold text-[#820000]">
                  {feature.title}
                </h3>
                <p className="mb-5 text-sm leading-[1.7] text-[#735656]">
                  {feature.description}
                </p>
                <Link
                  href={feature.href}
                  className="text-sm font-semibold text-[#A41515] no-underline hover:underline"
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
          <div className="mb-8 flex items-end justify-between gap-4 max-[700px]:flex-col max-[700px]:items-start">
            <div className="max-w-[540px]">
              <h2 className="font-serif text-[clamp(1.5rem,2.5vw,2rem)] font-bold text-[#820000]">
                Browse by Category
              </h2>
              <p className="mt-2 text-[15px] leading-[1.7] text-[#735656]">
                Explore mood boards for partywear, formal looks, everyday street style,
                and traditional dressing before you build your personalized closet.
              </p>
            </div>
            <Link
              href={ROUTES.register}
              className="text-sm font-semibold whitespace-nowrap text-[#A41515] no-underline hover:underline"
            >
              Start Styling
            </Link>
          </div>
          <div className="grid grid-cols-5 gap-4 max-[1024px]:grid-cols-3 max-[900px]:grid-cols-2 max-[600px]:gap-3">
            {WELCOME_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.href}
                className="group relative block aspect-[3/4.2] overflow-hidden rounded-[22px] no-underline shadow-[0_10px_28px_rgba(0,0,0,0.08)]"
                aria-label={`${cat.name} category`}
              >
                <Image
                  src={cat.image}
                  alt={cat.alt}
                  width={450}
                  height={600}
                  loading="lazy"
                  className="h-full w-full bg-[#FFECEC] object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-linear-to-t from-[rgba(45,30,28,0.88)] via-[rgba(45,30,28,0.22)] to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 z-1 p-4 text-white">
                  <span className="block text-[15px] font-bold tracking-[0.02em]">
                    {cat.name}
                  </span>
                  <span className="mt-1 block text-xs font-medium text-white/85">
                    Explore style direction
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E7B8B8] bg-welcome px-8 pt-12 pb-10 max-[600px]:px-4">
        <div className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)_auto] items-start gap-10 max-[700px]:grid-cols-1">
          <div className="max-w-[460px]">
            <Link href="/" className={`${LOGO_CLASS} mb-3.5 inline-block`}>
              FashioMe
            </Link>
            <p className="text-sm leading-[1.75] text-[#735656]">
              Curating global elegance with advanced artificial intelligence for the
              modern style enthusiast.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={ROUTES.register}
                className="inline-flex items-center justify-center rounded-full bg-[#820000] px-5 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#5F0000]"
              >
                Get Started
              </Link>
              <Link
                href={ROUTES.login}
                className="inline-flex items-center justify-center rounded-full border border-[#A41515] px-5 py-2.5 text-sm font-semibold text-[#820000] no-underline transition-colors hover:border-[#820000]"
              >
                Login
              </Link>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-7 max-[600px]:gap-5">
            <nav className="flex flex-wrap gap-7 max-[600px]:gap-5" aria-label="Footer">
              <a href="#dashboard" className={FOOTER_LINK_CLASS}>
                About
              </a>
              <a href="#recommendations" className={FOOTER_LINK_CLASS}>
                Style Guide
              </a>
              <a href="mailto:support@fashiome.ai" className={FOOTER_LINK_CLASS}>
                Support
              </a>
            </nav>
            <HomeFooterActions />
          </div>
        </div>
      </footer>
    </div>
  );
}
