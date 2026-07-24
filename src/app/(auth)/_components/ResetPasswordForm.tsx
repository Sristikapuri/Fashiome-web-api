"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { handleResetPassword } from "@/lib/actions/auth-action";
import { ROUTES } from "@/lib/routes";

const INPUT_CLASS =
  "w-full rounded-lg border-none bg-[#FFECEC] px-4 py-3.5 text-sm text-[#820000] outline-none placeholder:text-[#735656] focus:shadow-[0_0_0_2px_rgba(130,0,0,0.18)]";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(() => searchParams.get("email") || "");
  const [token, setToken] = useState(() => searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim() || !token.trim() || !password || !confirmPassword) {
      setError("Email, reset code, and new password are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    const result = await handleResetPassword({
      email,
      token,
      password,
      confirmPassword,
    });
    setIsSubmitting(false);

    if (result.success) {
      setMessage(result.message || "Password has been reset successfully");
      setPassword("");
      setConfirmPassword("");
    } else {
      setError(result.message || "Failed to reset password");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FFF7F7]">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 max-[500px]:px-4 max-[500px]:py-6">
        <div className="grid w-full max-w-[1040px] overflow-hidden rounded-[2.5rem] bg-white shadow-[0_16px_48px_rgba(74,29,29,0.08)] max-[900px]:max-w-[520px] max-[900px]:grid-cols-1 max-[500px]:rounded-[1.75rem] lg:grid-cols-2">
          <aside className="relative min-h-[560px] bg-[#820000] max-[900px]:min-h-[280px]">
            <Image
              src="/images/welcome/hero-gown.jpg"
              alt="Luxury fashion gown"
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
                Finish your password reset and return to your personal styling
                dashboard.
              </p>
            </div>
          </aside>

          <div className="flex flex-col justify-center px-10 py-12 max-[900px]:px-8 max-[900px]:py-10 max-[500px]:px-6 max-[500px]:py-8">
            <h1 className="mb-2 font-serif text-[2rem] font-bold text-[#820000]">
              Reset Password
            </h1>
            <p className="mb-8 text-sm leading-normal text-[#735656]">
              Open the reset link sent to your email. The reset code will be filled in
              automatically, or you can paste it below.
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

              <div>
                <label
                  htmlFor="token"
                  className="mb-2 block text-[13px] font-semibold text-[#820000]"
                >
                  Reset Code
                </label>
                <input
                  id="token"
                  type="text"
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  placeholder="6-digit reset code"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[13px] font-semibold text-[#820000]"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimum 6 characters"
                    autoComplete="new-password"
                    className={`${INPUT_CLASS} pr-12`}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 flex -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-transparent p-1 text-[#735656] hover:text-[#A41515]"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-[13px] font-semibold text-[#820000]"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Re-enter your new password"
                    autoComplete="new-password"
                    className={`${INPUT_CLASS} pr-12`}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 flex -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-transparent p-1 text-[#735656] hover:text-[#A41515]"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 w-full cursor-pointer rounded-full border-none bg-[#820000] px-4 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-[#5F0000] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
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
                href={ROUTES.forgotPassword}
                className="text-sm font-semibold text-[#735656] no-underline hover:text-[#820000] hover:underline"
              >
                Need a new reset link?
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
