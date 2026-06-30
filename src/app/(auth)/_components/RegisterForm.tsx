"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/lib/routes";
import { handleRegisterUser } from "@/lib/actions/auth-action";
import { registerSchema, type RegisterFormData } from "./schema";

const REGISTER_PANEL_IMAGE = {
  src: "/images/welcome/hero-editorial.jpg",
  alt: "Editorial fashion portrait — create your FashioMe account for AI outfit recommendations",
};

const FOOTER_LINK_CLASS =
  "text-[13px] font-medium text-[#735656] no-underline transition-colors hover:text-[#A41515]";

const INPUT_CLASS =
  "w-full rounded-lg border-none bg-[#FFECEC] px-4 py-3.5 text-sm text-[#820000] outline-none placeholder:text-[#735656] focus:shadow-[0_0_0_2px_rgba(130,0,0,0.18)]";

const INPUT_ERROR_CLASS =
  "w-full rounded-lg border border-[#E7B8B8] bg-[#FFF7F7] px-4 py-3.5 text-sm text-[#820000] outline-none placeholder:text-[#735656] focus:shadow-[0_0_0_2px_rgba(130,0,0,0.22)]";


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
      className="absolute top-1/2 right-3 flex -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-transparent p-1 text-[#735656] hover:text-[#A41515]"
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {},
  });


  useEffect(() => {
    if (!registerSuccess) return;
    const timer = setTimeout(() => router.push(ROUTES.login), 3000);
    return () => clearTimeout(timer);
  }, [registerSuccess, router]);

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);

    if (!acceptedTerms) {
      setApiError("Please accept the Terms and Privacy Policy to continue.");
      return;
    }

    // Ensure all data is properly serialized
    const serializedData = {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      gender: data.gender,
      age: data.age,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    const result = await handleRegisterUser(serializedData);

    if (result.success) {
      setRegisterSuccess(true);
    } else {
      setApiError(result.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FFF7F7]">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 max-[500px]:px-4 max-[500px]:py-6">
        <div className="grid w-full max-w-[1040px] overflow-hidden rounded-[2.5rem] bg-white shadow-[0_16px_48px_rgba(74,29,29,0.08)] max-[900px]:max-w-[520px] max-[900px]:grid-cols-1 max-[500px]:rounded-[1.75rem] lg:grid-cols-2">
          <aside
            className="relative min-h-[560px] bg-[#820000] max-[900px]:min-h-[280px]"
            aria-label="Join FashioMe fashion community"
          >
            <div
              className="pointer-events-none absolute top-8 right-8 left-8 h-48 rounded-t-[999px] bg-[#A41515]/40"
              aria-hidden="true"
            />
            <Image
              src={REGISTER_PANEL_IMAGE.src}
              alt={REGISTER_PANEL_IMAGE.alt}
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
                Where runway meets wardrobe — ethnic wear, street style, and
                couture, styled by AI for you.
              </p>
            </div>
          </aside>

          <div className="flex flex-col justify-center px-10 py-12 max-[900px]:px-8 max-[900px]:py-10 max-[500px]:px-6 max-[500px]:py-8">
            <h1 className="mb-2 font-serif text-[2rem] font-bold text-[#820000]">
              Join the Circle
            </h1>
            <p className="mb-8 text-sm leading-normal text-[#735656]">
              Build your style profile — tell us how you dress, and we&apos;ll
              curate looks for weddings, work, and weekends.
            </p>

            {registerSuccess ? (
              <div
                className="flex flex-col items-center rounded-2xl border border-[#c8e6c9] bg-[#f1f8f1] px-6 py-10 text-center"
                role="status"
                aria-live="polite"
              >
                <span
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#4a7c59] text-2xl font-bold text-white"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <h2 className="font-serif text-xl font-bold text-[#820000]">
                  Account created successfully!
                </h2>
                <p className="mt-2 max-w-[320px] text-sm leading-relaxed text-[#735656]">
                  Your FashioMe profile is ready. Sign in with your email and
                  password to continue.
                </p>
                <Link
                  href={ROUTES.login}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-[#820000] px-8 py-3.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#5F0000]"
                >
                  Continue to Login
                </Link>
                <p className="mt-4 text-xs text-[#735656]">Redirecting to login in a few seconds…</p>
              </div>
            ) : (
            <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                  htmlFor="firstName"
                  className="mb-2 block text-[13px] font-semibold text-[#820000]"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  {...register("firstName")}
                  type="text"
                  placeholder="John"
                  autoComplete="given-name"
                  className={`${errors.firstName ? INPUT_ERROR_CLASS : INPUT_CLASS}`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-[#c45c5c]">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-[13px] font-semibold text-[#820000]"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  {...register("lastName")}
                  type="text"
                  placeholder="Doe"
                  autoComplete="family-name"
                  className={`${errors.lastName ? INPUT_ERROR_CLASS : INPUT_CLASS}`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-[#c45c5c]">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-[13px] font-semibold text-[#820000]"
                >
                  Username
                </label>
                <input
                  id="username"
                  {...register("username")}
                  type="text"
                  placeholder="johndoe"
                  autoComplete="username"
                  className={`${errors.username ? INPUT_ERROR_CLASS : INPUT_CLASS}`}
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-[#c45c5c]">{errors.username.message}</p>
                )}
              </div>

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
                  placeholder="hello@fashiome.ai"
                  autoComplete="email"
                  className={`${errors.email ? INPUT_ERROR_CLASS : INPUT_CLASS}`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-[#c45c5c]">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="mb-2 block text-[13px] font-semibold text-[#820000]"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  {...register("gender")}
                  className={`${errors.gender ? INPUT_ERROR_CLASS : INPUT_CLASS}`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-xs text-[#c45c5c]">{errors.gender.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="age"
                  className="mb-2 block text-[13px] font-semibold text-[#820000]"
                >
                  Age
                </label>
                <input
                  id="age"
                  {...register("age")}
                  type="text"
                  placeholder="Enter your age"
                  autoComplete="off"
                  className={`${errors.age ? INPUT_ERROR_CLASS : INPUT_CLASS}`}
                />
                {errors.age && (
                  <p className="mt-1 text-xs text-[#c45c5c]">{errors.age.message}</p>
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
                    autoComplete="new-password"
                    className={`${errors.password ? INPUT_ERROR_CLASS : INPUT_CLASS} pr-12`}
                  />
                  <PasswordToggle
                    show={showPassword}
                    onToggle={() => setShowPassword((v) => !v)}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-[#c45c5c]">{errors.password.message}</p>
                )}
                <p className="mt-1.5 text-xs text-[#735656]">At least 6 characters</p>
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
                    {...register("confirmPassword")}
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    className={`${errors.confirmPassword ? INPUT_ERROR_CLASS : INPUT_CLASS} pr-12`}
                  />
                  <PasswordToggle
                    show={showConfirm}
                    onToggle={() => setShowConfirm((v) => !v)}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-[#c45c5c]">{errors.confirmPassword.message}</p>
                )}
              </div>


              <label className="flex cursor-pointer items-start gap-3 text-sm text-[#735656]">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    if (e.target.checked) setApiError(null);
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#820000]"
                />
                <span>
                  I agree to the{" "}
                  <a
                    href={`${ROUTES.welcome}#recommendations`}
                    className="font-semibold text-[#A41515] no-underline hover:underline"
                  >
                    Terms
                  </a>{" "}
                  and{" "}
                  <a
                    href={`${ROUTES.welcome}#dashboard`}
                    className="font-semibold text-[#A41515] no-underline hover:underline"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 w-full cursor-pointer rounded-full border-none bg-[#820000] px-4 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-[#5F0000] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Creating account…" : "Create Account"}
              </button>
            </form>
            )}

            {!registerSuccess && (
            <div className="mt-5">
              <div className="flex items-start gap-3 rounded-lg border border-[#E7B8B8] bg-[#FFF7F7] px-4 py-3.5">
                <span className="shrink-0 text-base leading-snug text-[#820000]" aria-hidden="true">
                  ✦
                </span>
                <p className="text-xs leading-[1.55] text-[#735656]">
                  Unlock outfit boards, occasion-based looks, and AI picks across
                  traditional, formal, casual, and party wear.
                </p>
              </div>
            </div>
            )}

            {!registerSuccess && (
            <p className="mt-6 text-center text-sm text-[#735656]">
              Already have an account?{" "}
              <Link
                href={ROUTES.login}
                className="font-bold text-[#820000] no-underline hover:underline"
              >
                Login
              </Link>
            </p>
            )}
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
          <Link href={ROUTES.login} className={FOOTER_LINK_CLASS}>
            Support
          </Link>
        </nav>
      </footer>
    </div>
  );
}
