import Link from "next/link";
import type { ReactNode } from "react";

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
      "Outfit pairings built from your color palette, body shape, and the latest runway and street-style trends.",
    link: "Explore Engine",
    href: "/register",
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
      "Wedding lehengas, office blazers, brunch co-ords, and date-night looks — styled for your calendar.",
    link: "View Occasions",
    href: "/register",
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
      "Cuts, hemlines, and silhouettes chosen to flatter your frame — from petite to plus, casual to couture.",
    link: "Set Profile",
    href: "/register",
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

const STYLE_TAGS = [
  "Minimalist",
  "Streetwear",
  "Ethnic Fusion",
  "Office Chic",
  "Resort Wear",
];

export default function Welcome() {
  return (
    <div className="welcome-page">
      <header className="welcome-header">
        <Link href="/" className="welcome-logo">
          FashioMe
        </Link>
        <nav className="welcome-nav" aria-label="Main">
          <Link href="/">Home</Link>
          <a href="#dashboard">Dashboard</a>
          <a href="#recommendations">Recommendations</a>
        </nav>
        <div className="welcome-header-end">
          <span className="welcome-avatar" aria-hidden="true">
            FM
          </span>
        </div>
      </header>

      <section className="welcome-hero">
        <div className="welcome-hero-inner">
          <div className="welcome-hero-copy">
            <p className="welcome-eyebrow">AI-Powered Personal Styling</p>
            <h1>Your Personal AI Fashion Stylist</h1>
            <p className="welcome-description">
              Discover outfits that match your personality, occasion, and style.
              From ethnic wear to runway trends — your wardrobe, reimagined by AI.
            </p>
            <ul className="welcome-style-tags" aria-label="Popular styles">
              {STYLE_TAGS.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <div className="welcome-actions">
              <Link href="/register" className="welcome-btn welcome-btn-primary">
                Get Started
              </Link>
              <Link href="/login" className="welcome-btn welcome-btn-outline">
                Login
              </Link>
              <Link href="/register" className="welcome-link-signup">
                Sign Up
              </Link>
            </div>
          </div>

          <div className="welcome-collage" aria-label="Sample AI-styled outfit looks">
            {WELCOME_HERO_IMAGES.map((img) => (
              <img
                key={img.id}
                src={img.src}
                alt={img.alt}
                width={520}
                height={520}
                loading="eager"
                decoding="async"
              />
            ))}
          </div>
        </div>
      </section>

      <section id="dashboard" className="welcome-engine">
        <div className="welcome-engine-inner">
          <div className="welcome-section-head">
            <h2>Intelligent Styling Engine</h2>
            <p>
              Think of it as a personal stylist in your pocket — mixing fabrics,
              seasons, and silhouettes into looks you will actually wear.
            </p>
          </div>
          <div className="welcome-feature-grid">
            {ENGINE_FEATURES.map((feature) => (
              <article key={feature.title} className="welcome-feature-card">
                <div className="welcome-feature-icon" aria-hidden="true">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <Link href={feature.href} className="welcome-card-link">
                  {feature.link} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="recommendations" className="welcome-categories">
        <div className="welcome-categories-inner">
          <div className="welcome-categories-head">
            <h2>Browse by Category</h2>
            <a href="#recommendations" className="welcome-view-all">
              View All Categories
            </a>
          </div>
          <div className="welcome-category-grid">
            {WELCOME_CATEGORIES.map((cat) => (
              <article
                key={cat.slug}
                className="welcome-category-card"
                aria-label={`${cat.name} category`}
              >
                <img
                  src={cat.image}
                  alt={cat.alt}
                  width={450}
                  height={600}
                  loading="lazy"
                  decoding="async"
                />
                <div className="welcome-category-overlay" aria-hidden="true" />
                <span className="welcome-category-label">{cat.name}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="welcome-footer">
        <div className="welcome-footer-inner">
          <div className="welcome-footer-brand">
            <Link href="/" className="welcome-logo">
              FashioMe
            </Link>
            <p>
              Where fashion meets intelligence — helping you dress sharper for
              every season, celebration, and everyday moment.
            </p>
          </div>
          <div className="welcome-footer-right">
            <nav className="welcome-footer-nav" aria-label="Footer">
              <a href="#dashboard">About</a>
              <a href="#recommendations">Style Guide</a>
              <a href="#recommendations">Terms</a>
              <Link href="/login">Support</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
