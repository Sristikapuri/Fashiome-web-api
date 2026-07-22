"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { handleForgotPassword } from "@/lib/actions/auth-action";
import { ROUTES } from "@/lib/routes";

const INPUT_CLASS =
  "w-full rounded-lg border-none bg-[#FFECEC] px-4 py-3.5 text-sm text-[#820000] outline-none placeholder:text-[#735656] focus:shadow-[0_0_0_2px_rgba(130,0,0,0.18)]";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Email is required");
      return;
    }

    setIsSubmitting(true);
    const result = await handleForgotPassword(normalizedEmail);
    setIsSubmitting(false);

    if (result.success) {
      setMessage(result.message || "If the email is registered, an OTP has been sent");
    } else {
      setError(result.message || "Failed to send password reset instructions");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FFF7F7]">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 max-[500px]:px-4 max-[500px]:py-6">
        <div className="grid w-full max-w-[1040px] overflow-hidden rounded-[2.5rem] bg-white shadow-[0_16px_48px_rgba(74,29,29,0.08)] max-[900px]:max-w-[520px] max-[900px]:grid-cols-1 max-[500px]:rounded-[1.75rem] lg:grid-cols-2">
          <aside className="relative min-h-[560px] bg-[#820000] max-[900px]:min-h-[280px]">
            <Image
              src="/images/welcome/hero-editorial.jpg"
              alt="Fashion editorial style"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-linear-to-t from-[rgba(62,39,35,0.58)] via-transparent to-transparent"
              aria-hidden="true"
            />
            <div className="absolute right-0 bottom-0 left-0 z-1 px-8 py-9">
              <Link
                href={ROUTES.welcome}
                className="mb-2.5 inline-block font-serif text-[2rem] font-bold text-white no-underline"
              >
                FashioMe
              </Link>
              <p className="max-w-[320px] text-[13px] leading-[1.6] text-white/90">
                Recover your account and get back to your saved outfits, AI style
                profile, and wardrobe picks.
              </p>
            </div>
          </aside>

          <div className="flex flex-col justify-center px-10 py-12 max-[900px]:px-8 max-[900px]:py-10 max-[500px]:px-6 max-[500px]:py-8">
            <h1 className="mb-2 font-serif text-[2rem] font-bold text-[#820000]">
              Forgot Password
            </h1>
            <p className="mb-8 text-sm leading-normal text-[#735656]">
              Enter your email address. If it belongs to an account, we&apos;ll send
              you a one-time code to reset your password.
            </p>

            <form className="flex flex-col gap-5" onSubmit={onSubmit}>
              {message && (
                <p className="rounded-lg border border-[#B7DFC2] bg-[#F4FFF6] px-4 py-3 text-sm text-[#23613A]">
                  {message}
                </p>
              )}
              {error && (
                <p className="rounded-lg border border-[#E7B8B8] bg-[#FFF7F7] px-4 py-3 text-sm text-[#8b3030]">
                  {error}
                </p>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[13px] font-semibold text-[#820000]"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="stylist@fashiome.ai"
                  autoComplete="email"
                  className={INPUT_CLASS}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 w-full cursor-pointer rounded-full border-none bg-[#820000] px-4 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-[#5F0000] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between gap-3 max-[500px]:flex-col max-[500px]:items-start">
              <Link
                href={ROUTES.login}
                className="text-sm font-semibold text-[#820000] no-underline hover:underline"
              >
                Back to login
              </Link>
              <Link
                href={`${ROUTES.resetPassword}${email ? `?email=${encodeURIComponent(email.trim())}` : ""}`}
                className="text-sm font-semibold text-[#735656] no-underline hover:text-[#820000] hover:underline"
              >
                Already have an OTP?
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
