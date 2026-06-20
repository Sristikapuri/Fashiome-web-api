"use client";

import { useState, useTransition, useRef, type FormEvent } from "react";
import Link from "next/link";
import { handleUpdatePassword } from "@/lib/actions/auth-action";
import { ROUTES } from "@/lib/routes";

const inputClass =
  "w-full rounded-lg border border-[#E7B8B8] bg-[#FFF7F7] px-4 py-3 text-sm text-[#260909] outline-none transition focus:border-[#820000] focus:bg-white focus:ring-2 focus:ring-[#820000]/20";

export default function PasswordUpdatePage() {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await handleUpdatePassword({
        password: String(formData.get("password") || ""),
        confirmPassword: String(formData.get("confirmPassword") || ""),
      });
      setMessage(result.message);
      if (result.success && formRef.current) {
        formRef.current.reset();
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#FFF7F7] px-5 py-8 text-[#260909]">
      <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg bg-[#4A0000] p-6 text-white shadow-[0_18px_40px_rgba(74,29,29,0.14)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FFDADA]">Security</p>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">Update Password</h1>
          <p className="mt-4 text-sm leading-6 text-[#FFECEC]">Choose a new password with at least six characters for your FashioMe account.</p>
          <Link href={ROUTES.profile} className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-[#4A0000] no-underline transition hover:bg-[#FFECEC]">
            Back to profile
          </Link>
        </div>

        <div className="rounded-lg border border-[#E7B8B8] bg-white p-6 shadow-[0_10px_30px_rgba(74,29,29,0.06)] md:p-8">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-[#735656]">New password</span>
              <input name="password" type="password" minLength={6} required className={inputClass} />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-[#735656]">Confirm password</span>
              <input name="confirmPassword" type="password" minLength={6} required className={inputClass} />
            </label>
            <button type="submit" disabled={isPending} className="rounded-full bg-[#820000] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#5F0000] disabled:opacity-60">
              {isPending ? "Saving..." : "Save password"}
            </button>
            {message && <p className="rounded-full bg-[#FFF7F7] px-4 py-2 text-sm font-semibold text-[#735656]">{message}</p>}
          </form>
        </div>
      </section>
    </main>
  );
}
