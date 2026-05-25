"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ROUTES } from "@/lib/routes";

const REGISTER_PANEL_IMAGE = {
  src: "/images/register-model.jpg",
  alt: "Editorial fashion portrait — create your FashioMe account for AI outfit recommendations",
};

const FOOTER_LINK_CLASS =
  "text-[13px] font-medium text-muted no-underline transition-colors hover:text-primary";

const INPUT_CLASS =
  "w-full rounded-lg border-none bg-[#F3F4F6] px-4 py-3.5 text-sm text-heading outline-none placeholder:text-muted focus:shadow-[0_0_0_2px_rgba(74,29,29,0.2)]";

const INPUT_ERROR_CLASS =
  "w-full rounded-lg border border-[#e8a0a0] bg-[#fff8f8] px-4 py-3.5 text-sm text-heading outline-none placeholder:text-muted focus:shadow-[0_0_0_2px_rgba(200,80,80,0.25)]";

const GENDERS = ["Male", "Female", "Other"] as const;
type Gender = (typeof GENDERS)[number];

function PasswordToggle({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="absolute top-1/2 right-3 flex -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-transparent p-1 text-muted hover:text-primary"
      onClick={onToggle}
      aria-label={show ? "Hide password" : "Show password"}
    >
      {show ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 3l18 18M10.5 10.7a3 3 0 004.6 4.6M9.9 5.1A9.8 9.8 0 0112 5c5 0 9.3 3.4 10.5 7-0.4 1.2-1.2 2.3-2.2 3.2M6.7 6.7C4.6 8.1 3.1 10.2 2.5 12c1.2 3.6 5.5 7 10.5 7 1.1 0 2.2-0.2 3.2-0.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M2.5 12C3.7 8.4 8 5 12 5s8.3 3.4 9.5 7c-1.2 3.6-5.5 7-9.5 7S3.7 15.6 2.5 12z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )}
    </button>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const [gender, setGender] = useState<Gender>("Male");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setPasswordMismatch(false);

    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement)
      .value;

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      setFormError("Passwords do not match. Please check and try again.");
      return;
    }

    if (!acceptedTerms) {
      setFormError("Please accept the Terms and Privacy Policy to continue.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      router.push(ROUTES.login);
    }, 400);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F4]">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 max-[500px]:px-4 max-[500px]:py-6">
        <div className="grid w-full max-w-[1040px] overflow-hidden rounded-[2.5rem] bg-white shadow-[0_16px_48px_rgba(74,29,29,0.08)] max-[900px]:max-w-[520px] max-[900px]:grid-cols-1 max-[500px]:rounded-[1.75rem] lg:grid-cols-2">
          <aside
            className="relative min-h-[560px] bg-[#C29B82] max-[900px]:min-h-[280px]"
            aria-label="Join FashioMe fashion community"
          >
            <div
              className="pointer-events-none absolute top-8 right-8 left-8 h-48 rounded-t-[999px] bg-[#A67B64]/40"
              aria-hidden="true"
            />
            <img
              src={REGISTER_PANEL_IMAGE.src}
              alt={REGISTER_PANEL_IMAGE.alt}
              className="absolute inset-0 h-full w-full object-cover object-center"
              width={520}
              height={680}
              loading="eager"
              decoding="async"
            />
            <div
              className="absolute inset-0 bg-linear-to-t from-[rgba(62,39,35,0.55)] via-transparent to-transparent"
              aria-hidden="true"
            />
            <div className="absolute right-0 bottom-0 left-0 z-1 px-8 py-9">
              <Link
                href={ROUTES.welcome}
                className="mb-2.5 inline-block font-serif text-[2rem] font-bold text-white no-underline"
              >
                FashioMe
              </Link>
              <p className="max-w-[300px] text-[13px] leading-[1.6] text-white/90">
                Where runway meets wardrobe — ethnic wear, street style, and
                couture, styled by AI for you.
              </p>
            </div>
          </aside>

          <div className="flex flex-col justify-center px-10 py-12 max-[900px]:px-8 max-[900px]:py-10 max-[500px]:px-6 max-[500px]:py-8">
            <h1 className="mb-2 font-serif text-[2rem] font-bold text-[#4A1D1F]">
              Join the Circle
            </h1>
            <p className="mb-8 text-sm leading-normal text-muted">
              Build your style profile — tell us how you dress, and we&apos;ll
              curate looks for weddings, work, and weekends.
            </p>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
              {formError && (
                <p
                  role="alert"
                  className="rounded-lg border border-[#e8a0a0] bg-[#fff5f5] px-4 py-3 text-sm text-[#8b3030]"
                >
                  {formError}
                </p>
              )}

              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-[13px] font-semibold text-heading"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Your name as on your style profile"
                  autoComplete="name"
                  required
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[13px] font-semibold text-heading"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="hello@fashiome.ai"
                  autoComplete="email"
                  required
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[13px] font-semibold text-heading"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className={`${passwordMismatch ? INPUT_ERROR_CLASS : INPUT_CLASS} pr-12`}
                    onChange={() => setPasswordMismatch(false)}
                  />
                  <PasswordToggle
                    show={showPassword}
                    onToggle={() => setShowPassword((v) => !v)}
                  />
                </div>
                <p className="mt-1.5 text-xs text-muted">At least 8 characters</p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-[13px] font-semibold text-heading"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className={`${passwordMismatch ? INPUT_ERROR_CLASS : INPUT_CLASS} pr-12`}
                    onChange={() => setPasswordMismatch(false)}
                  />
                  <PasswordToggle
                    show={showConfirm}
                    onToggle={() => setShowConfirm((v) => !v)}
                  />
                </div>
              </div>

              <fieldset className="m-0 border-none p-0">
                <legend className="mb-2.5 block text-[13px] font-semibold text-heading">
                  Style profile — I usually shop for
                </legend>
                <div
                  className="grid grid-cols-3 gap-0 rounded-lg bg-[#F3F4F6] p-1"
                  role="radiogroup"
                  aria-label="Style profile"
                >
                  {GENDERS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={gender === option}
                      className={`cursor-pointer rounded-md border-none px-2 py-3 text-sm font-medium transition-[background,color,box-shadow] ${
                        gender === option
                          ? "bg-white text-heading shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                          : "bg-transparent text-muted"
                      }`}
                      onClick={() => setGender(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="gender" value={gender} />
              </fieldset>

              <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
                <input
                  type="checkbox"
                  name="terms"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    if (e.target.checked) setFormError(null);
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#9498C1]"
                />
                <span>
                  I agree to the{" "}
                  <a
                    href={`${ROUTES.welcome}#recommendations`}
                    className="font-semibold text-primary no-underline hover:underline"
                  >
                    Terms
                  </a>{" "}
                  and{" "}
                  <a
                    href={`${ROUTES.welcome}#dashboard`}
                    className="font-semibold text-primary no-underline hover:underline"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 w-full cursor-pointer rounded-full border-none bg-[#9498C1] px-4 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-[#7f83ad] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Creating account…" : "Create Account"}
              </button>
            </form>

            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3 rounded-lg border border-[#f0d8d8] bg-[#fdf5f5] px-4 py-3.5">
                <span className="shrink-0 text-sm text-[#c45c5c]" aria-hidden="true">
                  ✦
                </span>
                <p className="text-xs leading-[1.55] text-muted">
                  Signing up unlocks our AI Recommendation Engine for bespoke
                  cultural styling.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-[#ebe6e2] bg-[#faf8f6] px-4 py-3.5">
                <span className="shrink-0 text-base leading-snug text-primary" aria-hidden="true">
                  ✦
                </span>
                <p className="text-xs leading-[1.55] text-muted">
                  Unlock outfit boards, occasion-based looks, and AI picks across
                  traditional, formal, casual, and party wear.
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-muted">
              Already have an account?{" "}
              <Link
                href={ROUTES.login}
                className="font-bold text-heading no-underline hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="flex w-full items-center justify-between border-t border-[#ebe6e2] bg-white px-8 py-6 max-[600px]:flex-col max-[600px]:gap-4 max-[600px]:px-6 max-[600px]:text-center">
        <Link
          href={ROUTES.welcome}
          className="font-serif text-[1.15rem] font-bold text-[#4A1D1F] no-underline"
        >
          FashioMe
        </Link>
        <nav
          className="flex flex-wrap gap-7 max-[600px]:justify-center max-[600px]:gap-5"
          aria-label="Footer"
        >
          <a href={`${ROUTES.welcome}#dashboard`} className={FOOTER_LINK_CLASS}>
            About
          </a>
          <a href={`${ROUTES.welcome}#recommendations`} className={FOOTER_LINK_CLASS}>
            Style Guide
          </a>
          <a href={`${ROUTES.welcome}#recommendations`} className={FOOTER_LINK_CLASS}>
            Terms
          </a>
          <Link href={ROUTES.login} className={FOOTER_LINK_CLASS}>
            Support
          </Link>
        </nav>
      </footer>
    </div>
  );
}
