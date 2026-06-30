"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleCreateUser } from "@/lib/actions/admin/user-action";
import { createUserSchema, type CreateUserFormData } from "./schema";

const fieldClass =
  "h-12 w-full rounded-2xl border border-[#e7c7bc] bg-[#fffaf7] px-4 text-sm text-[#260909] outline-none transition focus:border-[#a43a24]";
const labelClass = "mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#6f574f]";
const errClass = "mt-1 block text-sm text-red-600";

export default function UserForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      gender: "female",
      age: 18,
      role: "user",
      status: "active",
    },
  });

  const onSubmit = (data: CreateUserFormData) => {
    setError("");
    startTransition(async () => {
      try {
        const result = await handleCreateUser({
          ...data,
          age: Number(data.age),
        });

        if (!result.success) {
          throw new Error(result.message || "Failed to create user");
        }

        router.push("/dashboard/admin/users");
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
          <label className={labelClass}>Password</label>
          <input type="password" {...register("password")} placeholder="••••••••" className={fieldClass} />
          {errors.password ? <span className={errClass}>{errors.password.message}</span> : null}
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
          <input type="number" min="1" max="100" {...register("age", { valueAsNumber: true })} className={fieldClass} />
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
            onClick={() => router.push("/dashboard/admin/users")}
            className="rounded-full border border-[#e7c7bc] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#6f574f] transition hover:bg-[#fff6f2]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isPending}
            className="rounded-full bg-[#a43a24] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#8f3120] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
