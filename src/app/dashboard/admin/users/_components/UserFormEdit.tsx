"use client";

import { Controller, useForm } from "react-hook-form";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { handleUpdateUser } from "@/lib/actions/admin/user-action";
import { editUserSchema, type EditUserFormData } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getApiBaseUrl } from "@/lib/api/base-url";

const fieldClass =
  "h-12 w-full rounded-2xl border border-[#e7c7bc] bg-[#fffaf7] px-4 text-sm text-[#260909] outline-none transition focus:border-[#a43a24]";
const labelClass = "mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#6f574f]";
const errClass = "mt-1 block text-sm text-red-600";
const BASE_URL = getApiBaseUrl();

function resolveImageSrc(value?: string) {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  return `${BASE_URL}${value}`;
}

export default function UserFormEdit({ user }: { user: any }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
      defaultValues: {
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        username: user?.username || "",
        gender: user?.gender || "female",
        age: user?.age || 18,
        role: user?.role || "user",
      status: user?.status || "active",
      profileImage: undefined,
    },
  });

  const currentImage = resolveImageSrc(user?.profileImage);

  const handleImageChange = (
    file: File | undefined,
    onChange: (file: File | undefined) => void
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }

    onChange(file);
  };

  const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (data: EditUserFormData) => {
    setError("");
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("email", data.email);
        formData.append("username", data.username);
        formData.append("gender", data.gender);
        formData.append("age", String(data.age));
        formData.append("role", data.role);
        formData.append("status", data.status);

        if (data.profileImage) {
          formData.append("profileImage", data.profileImage);
        }

        const result = await handleUpdateUser(user._id, formData);

        if (!result.success) {
          throw new Error(result.message || "Failed to update user");
        }

        router.push(`/dashboard/admin/users/${user._id}`);
        router.refresh();
      } catch (err: any) {
        setError(err?.message || "Something went wrong");
      }
    });
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 md:grid-cols-2">
        {error ? (
          <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="md:col-span-2">
          <div className="mb-4 flex items-center gap-4">
            {previewImage ? (
              <div className="relative h-24 w-24">
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={96}
                  height={96}
                  unoptimized
                  className="h-24 w-24 rounded-full object-cover"
                />
                <Controller
                  name="profileImage"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <button
                      type="button"
                      onClick={() => handleDismissImage(onChange)}
                      className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#d94d36] text-sm text-white"
                      aria-label="Remove selected image"
                    >
                      ✕
                    </button>
                  )}
                />
              </div>
            ) : currentImage ? (
              <Image
                src={currentImage}
                alt={`${user?.firstName} ${user?.lastName}`}
                width={96}
                height={96}
                unoptimized
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#fff6f2] text-xs font-bold text-[#9a7e74]">
                No Image
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-[#311812]">Profile image</p>
              <p className="mt-1 text-xs text-[#6f574f]">
                Upload a new image if you want to replace the current user photo.
              </p>
            </div>
          </div>

          <label className={labelClass}>Profile image</label>
          <Controller
            name="profileImage"
            control={control}
            render={({ field: { onChange } }) => (
              <input
                ref={fileInputRef}
                type="file"
                onChange={(event) => handleImageChange(event.target.files?.[0], onChange)}
                accept=".jpg,.jpeg,.png,.webp"
                className="w-full text-sm text-[#6f574f] file:mr-3 file:rounded-full file:border-0 file:bg-[#a43a24] file:px-4 file:py-2 file:text-xs file:font-bold file:text-white"
              />
            )}
          />
          {errors.profileImage ? <span className={errClass}>{errors.profileImage.message}</span> : null}
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Email</label>
          <input type="email" {...register("email")} placeholder="you@example.com" className={fieldClass} />
          {errors.email ? <span className={errClass}>{errors.email.message}</span> : null}
        </div>

        <div>
          <label className={labelClass}>First name</label>
          <input type="text" {...register("firstName")} placeholder="Jane" className={fieldClass} />
          {errors.firstName ? <span className={errClass}>{errors.firstName.message}</span> : null}
        </div>

        <div>
          <label className={labelClass}>Last name</label>
          <input type="text" {...register("lastName")} placeholder="Doe" className={fieldClass} />
          {errors.lastName ? <span className={errClass}>{errors.lastName.message}</span> : null}
        </div>

        <div>
          <label className={labelClass}>Username</label>
          <input type="text" {...register("username")} placeholder="janedoe" className={fieldClass} />
          {errors.username ? <span className={errClass}>{errors.username.message}</span> : null}
        </div>

        <div>
          <label className={labelClass}>Gender</label>
          <select {...register("gender")} className={fieldClass}>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
          {errors.gender ? <span className={errClass}>{errors.gender.message}</span> : null}
        </div>

        <div>
          <label className={labelClass}>Age</label>
          <input
            type="number"
            min="1"
            max="100"
            {...register("age", { valueAsNumber: true })}
            className={fieldClass}
          />
          {errors.age ? <span className={errClass}>{errors.age.message}</span> : null}
        </div>

        <div>
          <label className={labelClass}>Role</label>
          <select {...register("role")} className={fieldClass}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role ? <span className={errClass}>{errors.role.message}</span> : null}
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select {...register("status")} className={fieldClass}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status ? <span className={errClass}>{errors.status.message}</span> : null}
        </div>

        <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push(`/dashboard/admin/users/${user._id}`)}
            className="rounded-full border border-[#e7c7bc] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#6f574f] transition hover:bg-[#fff6f2]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isPending}
            className="rounded-full bg-[#a43a24] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#8f3120] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
