"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/lib/routes";
import { handleLoginUser } from "@/lib/actions/auth-action";
import { useAuth } from "@/lib/contexts/AuthContext";
import { loginSchema, type LoginFormData } from "./schema";

const LOGIN_PANEL_IMAGE = {
  src: "/images/welcome/cat-formal.jpg",
  alt: "Formal fashion look — log in to access your FashioMe saved outfits and daily style picks",
};

const FOOTER_LINK_CLASS =
  "text-[13px] font-medium text-[#735656] no-underline transition-colors hover:text-[#A41515]";

const INPUT_CLASS =
  "w-full rounded-lg border-none bg-[#FFECEC] px-4 py-3.5 text-sm text-[#820000] outline-none placeholder:text-[#735656] focus:shadow-[0_0_0_2px_rgba(130,0,0,0.18)]";

const INPUT_ERROR_CLASS =
  "w-full rounded-lg border border-[#E7B8B8] bg-[#FFF7F7] px-4 py-3.5 text-sm text-[#820000] outline-none placeholder:text-[#735656] focus:shadow-[0_0_0_2px_rgba(130,0,0,0.22)]";

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);

    const result = await handleLoginUser(data);

    if (result.success) {
      const token = result.data?.token;
      if (token) {
        localStorage.setItem("token", token);
      }
      setUser(result.data?.user || null);
      const role = result.data?.user?.role;
      router.push(role === "admin" ? ROUTES.admin : ROUTES.dashboard);
    } else {
      setApiError(result.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FFF7F7]">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 max-[500px]:px-4 max-[500px]:py-6">
        <div className="grid w-full max-w-[1040px] overflow-hidden rounded-[2.5rem] bg-white shadow-[0_16px_48px_rgba(74,29,29,0.08)] max-[900px]:max-w-[520px] max-[900px]:grid-cols-1 max-[500px]:rounded-[1.75rem] lg:grid-cols-2">
          <aside
            className="relative min-h-[560px] bg-[#820000] max-[900px]:min-h-[280px]"
            aria-label="FashioMe fashion styling"
          >
            <div
              className="pointer-events-none absolute top-8 right-8 left-8 h-48 rounded-t-[999px] bg-[#A41515]/40"
              aria-hidden="true"
            />
            <Image
              src={LOGIN_PANEL_IMAGE.src}
              alt={LOGIN_PANEL_IMAGE.alt}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 50vw"
              className="object-cover object-center"
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
                Your wardrobe, elevated — AI outfit picks for every season,
                celebration, and everyday moment.
              </p>
            </div>
          </aside>

          <div className="flex flex-col justify-center px-10 py-12 max-[900px]:px-8 max-[900px]:py-10 max-[500px]:px-6 max-[500px]:py-8">
            <h1 className="mb-2 font-serif text-[2rem] font-bold text-[#820000]">
              Welcome Back
            </h1>
            <p className="mb-8 text-sm leading-normal text-[#735656]">
              Sign in to access your saved looks, style profile, and daily outfit
              recommendations.
            </p>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
              {apiError && (
                <p
                  role="alert"
                  className="rounded-lg border border-[#E7B8B8] bg-[#FFF7F7] px-4 py-3 text-sm text-[#8b3030]"
                >
                  {apiError}
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
                  {...register("email")}
                  type="email"
                  placeholder="stylist@fashiome.ai"
                  autoComplete="email"
                  className={`${errors.email ? INPUT_ERROR_CLASS : INPUT_CLASS}`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-[#c45c5c]">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[13px] font-semibold text-[#820000]"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Your secure password"
                    autoComplete="current-password"
                    className={`${errors.password ? INPUT_ERROR_CLASS : INPUT_CLASS} pr-12`}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 flex -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-transparent p-1 text-[#735656] hover:text-[#A41515]"
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
                {errors.password && (
                  <p className="mt-1 text-xs text-[#c45c5c]">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 w-full cursor-pointer rounded-full border-none bg-[#820000] px-4 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-[#5F0000] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Signing in..." : "Login to My Wardrobe"}
              </button>
            </form>

            <div className="mt-5 flex items-start gap-3 rounded-lg border border-[#E7B8B8] bg-[#FFF7F7] px-4 py-3.5">
              <span className="shrink-0 text-lg leading-none" aria-hidden="true">
                👗
              </span>
              <p className="text-xs leading-[1.55] text-[#735656]">
                New here? Create a free account and get your first AI-curated
                outfit in minutes.
              </p>
            </div>

            <p className="mt-6 text-center text-sm text-[#735656]">
              Don&apos;t have an account?{" "}
              <Link
                href={ROUTES.register}
                className="font-bold text-[#820000] no-underline hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="flex w-full items-center justify-between border-t border-[#E7B8B8] bg-white px-8 py-6 max-[600px]:flex-col max-[600px]:gap-4 max-[600px]:px-6 max-[600px]:text-center">
        <Link
          href={ROUTES.welcome}
          className="font-serif text-[1.15rem] font-bold text-[#820000] no-underline"
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
          <Link href={ROUTES.register} className={FOOTER_LINK_CLASS}>
            Support
          </Link>
        </nav>
      </footer>
    </div>
  );
}
