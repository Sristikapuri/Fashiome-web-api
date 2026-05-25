"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

const LOGIN_PANEL_IMAGE = {
  src: "/images/welcome/cat-formal.jpg",
  alt: "Formal fashion look — log in to access your FashioMe saved outfits and daily style picks",
};

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <aside className="login-left-panel" aria-label="FashioMe fashion styling">
          <img
            src={LOGIN_PANEL_IMAGE.src}
            alt={LOGIN_PANEL_IMAGE.alt}
            className="login-left-image"
            width={520}
            height={680}
            loading="eager"
            decoding="async"
          />
          <div className="login-left-overlay" />
          <div className="login-left-brand">
            <Link href="/" className="login-left-logo">
              FashioMe
            </Link>
            <p>
              Your wardrobe, elevated — AI outfit picks for every season,
              celebration, and everyday moment.
            </p>
          </div>
        </aside>

        <div className="login-right-panel">
          <h1>Welcome Back</h1>
          <p className="login-subtitle">
            Sign in to access your saved looks, style profile, and daily outfit
            recommendations.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="stylist@fashiome.ai"
                autoComplete="email"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="login-input-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your secure password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M3 3l18 18M10.5 10.7a3 3 0 004.6 4.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M2.5 12C3.7 8.4 8 5 12 5s8.3 3.4 9.5 7c-1.2 3.6-5.5 7-9.5 7S3.7 15.6 2.5 12z" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn">
              Login to My Wardrobe
            </button>
          </form>

          <div className="login-fashion-note">
            <span aria-hidden="true">👗</span>
            <p>
              New here? Create a free account and get your first AI-curated
              outfit in minutes.
            </p>
          </div>

          <p className="login-register-prompt">
            Don&apos;t have an account? <Link href="/register">Register</Link>
          </p>
        </div>
      </div>

      <footer className="login-footer">
        <Link href="/" className="login-footer-logo">
          FashioMe
        </Link>
        <nav className="login-footer-nav" aria-label="Footer">
          <a href="/#dashboard">About</a>
          <a href="/#recommendations">Style Guide</a>
          <a href="/#recommendations">Terms</a>
          <Link href="/register">Support</Link>
        </nav>
      </footer>
    </div>
  );
}
