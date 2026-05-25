"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

const REGISTER_PANEL_IMAGE = {
  src: "/images/welcome/hero-editorial.jpg",
  alt: "Editorial fashion portrait — create your FashioMe account for AI outfit recommendations",
};

const GENDERS = ["Male", "Female", "Other"] as const;
type Gender = (typeof GENDERS)[number];

export default function RegisterForm() {
  const [gender, setGender] = useState<Gender>("Male");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <aside className="register-left-panel" aria-label="Join FashioMe fashion community">
          <img
            src={REGISTER_PANEL_IMAGE.src}
            alt={REGISTER_PANEL_IMAGE.alt}
            className="register-left-image"
            width={520}
            height={680}
            loading="eager"
            decoding="async"
          />
          <div className="register-left-overlay" />
          <div className="register-left-brand">
            <Link href="/" className="register-left-logo">
              FashioMe
            </Link>
            <p>
              Where runway meets wardrobe — ethnic wear, street style, and
              couture, styled by AI for you.
            </p>
          </div>
        </aside>

        <div className="register-right-panel">
          <h1>Join the Circle</h1>
          <p className="register-subtitle">
            Build your style profile — tell us how you dress, and we&apos;ll
            curate looks for weddings, work, and weekends.
          </p>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-field">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Your name as on your style profile"
                autoComplete="name"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="hello@fashiome.ai"
                autoComplete="email"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="password">Password</label>
              <div className="register-input-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="register-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M3 3l18 18M10.5 10.7a3 3 0 004.6 4.6M9.9 5.1A9.8 9.8 0 0112 5c5 0 9.3 3.4 10.5 7-0.4 1.2-1.2 2.3-2.2 3.2M6.7 6.7C4.6 8.1 3.1 10.2 2.5 12c1.2 3.6 5.5 7 10.5 7 1.1 0 2.2-0.2 3.2-0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

            <div className="register-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="register-input-wrap">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="register-eye-btn"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M3 3l18 18M10.5 10.7a3 3 0 004.6 4.6M9.9 5.1A9.8 9.8 0 0112 5c5 0 9.3 3.4 10.5 7-0.4 1.2-1.2 2.3-2.2 3.2M6.7 6.7C4.6 8.1 3.1 10.2 2.5 12c1.2 3.6 5.5 7 10.5 7 1.1 0 2.2-0.2 3.2-0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

            <fieldset className="register-gender">
              <legend>Style profile — I usually shop for</legend>
              <div className="register-gender-options" role="radiogroup" aria-label="Style profile">
                {GENDERS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={gender === option}
                    className={gender === option ? "active" : ""}
                    onClick={() => setGender(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <input type="hidden" name="gender" value={gender} />
            </fieldset>

            <button type="submit" className="register-btn">
              Create Account
            </button>
          </form>

          <div className="register-ai-note">
            <span className="register-ai-icon" aria-hidden="true">✦</span>
            <p>
              Unlock outfit boards, occasion-based looks, and AI picks across
              traditional, formal, casual, and party wear.
            </p>
          </div>

          <p className="register-login-prompt">
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </div>
      </div>

      <footer className="register-footer">
        <Link href="/" className="register-footer-logo">
          FashioMe
        </Link>
        <nav className="register-footer-nav" aria-label="Footer">
          <a href="/#dashboard">About</a>
          <a href="/#recommendations">Style Guide</a>
          <a href="/#recommendations">Terms</a>
          <Link href="/login">Support</Link>
        </nav>
      </footer>
    </div>
  );
}
