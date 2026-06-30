"use client";

import { useEffect, useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { handleLoadCurrentUser, handleUpdateProfile } from "@/lib/actions/auth-action";
import { ROUTES } from "@/lib/routes";
import { useAuth, type AuthUser } from "@/lib/contexts/AuthContext";

const inputClass =
  "w-full rounded-lg border border-[#E7B8B8] bg-[#FFF7F7] px-4 py-3 text-sm text-[#260909] outline-none transition focus:border-[#820000] focus:bg-white focus:ring-2 focus:ring-[#820000]/20";
const labelClass = "text-sm font-medium text-[#735656]";
const fallbackProfileImage = "/images/welcome/cat-formal.jpg";

type ProfileFormState = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender: string;
  age: string;
  profileImage: string;
};

function normalizeUser(user: AuthUser): ProfileFormState {
  return {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    username: user.username ?? "",
    email: user.email ?? "",
    gender: user.gender ?? "female",
    age: typeof user.age === "number" ? String(user.age) : "",
    profileImage: user.profileImage ?? "",
  };
}

function getProfileImageSrc(src?: string) {
  if (!src) return fallbackProfileImage;
  if (src.startsWith("blob:") || src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }
  return `/${src}`;
}

export function UpdateForm({ initialUser }: { initialUser: AuthUser }) {
  const { user, setUser } = useAuth();
  const currentUser = user || initialUser;
  const [form, setForm] = useState<ProfileFormState>(() => normalizeUser(currentUser));
  const [preview, setPreview] = useState(currentUser.profileImage || fallbackProfileImage);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const result = await handleLoadCurrentUser();
      if (result.success && result.data) {
        setUser(result.data);
        setForm(normalizeUser(result.data));
        setPreview(result.data.profileImage || fallbackProfileImage);
      }
    });
  }, [setUser]);

  const handleChange = (field: keyof ProfileFormState, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setMessage("");
      const result = await handleUpdateProfile(formData);
      setMessage(result.message);
      if (result.success && result.data) {
        setUser(result.data);
        setForm(normalizeUser(result.data));
        setPreview(result.data.profileImage || fallbackProfileImage);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <div className="rounded-lg bg-[#4A0000] p-5 text-white">
        <div className="h-44 w-44 overflow-hidden rounded-full border-4 border-[#A41515] bg-white">
          <Image
            src={getProfileImageSrc(preview)}
            alt="Profile"
            width={176}
            height={176}
            unoptimized
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-5">
          <p className="text-xl font-bold">{form.firstName} {form.lastName}</p>
          <p className="mt-1 break-all text-sm text-[#FFECEC]">{form.email}</p>
        </div>
        <label className="mt-5 block">
          <span className="text-sm font-semibold text-[#FFDADA]">Profile image</span>
          <input
            name="profileImage"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleImageChange}
            className="mt-2 block w-full text-sm text-[#FFECEC] file:mr-3 file:rounded-full file:border-0 file:bg-[#A41515] file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
          />
        </label>
        <Link href={ROUTES.password} className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-[#4A0000] no-underline transition hover:bg-[#FFECEC]">
          Change password
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className={labelClass}>First name</span>
          <input name="firstName" value={form.firstName} onChange={(event) => handleChange("firstName", event.target.value)} className={inputClass} />
        </label>
        <label className="space-y-2">
          <span className={labelClass}>Last name</span>
          <input name="lastName" value={form.lastName} onChange={(event) => handleChange("lastName", event.target.value)} className={inputClass} />
        </label>
        <label className="space-y-2">
          <span className={labelClass}>Username</span>
          <input name="username" value={form.username} onChange={(event) => handleChange("username", event.target.value)} className={inputClass} />
        </label>
        <label className="space-y-2">
          <span className={labelClass}>Email</span>
          <input name="email" type="email" value={form.email} disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
        </label>
        <label className="space-y-2">
          <span className={labelClass}>Gender</span>
          <select name="gender" value={form.gender} onChange={(event) => handleChange("gender", event.target.value)} className={inputClass}>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className={labelClass}>Age</span>
          <input name="age" type="number" min="1" max="100" value={form.age} onChange={(event) => handleChange("age", event.target.value)} className={inputClass} />
        </label>

        <div className="md:col-span-2 flex flex-wrap items-center gap-3 border-t border-[#E7B8B8] pt-5">
          <button type="submit" disabled={isPending} className="rounded-full bg-[#820000] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#5F0000] disabled:opacity-60">
            {isPending ? "Saving..." : "Save profile"}
          </button>
          {message && <p className="rounded-full bg-[#FFF7F7] px-4 py-2 text-sm font-semibold text-[#735656]">{message}</p>}
        </div>
      </div>
    </form>
  );
}
