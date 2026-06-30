"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clothesSchema, type ClothesFormData } from "./schema";
import { handleCreateClothe, handleUpdateClothe } from "@/lib/actions/admin/clothes-action";
import Image from "next/image";

const fieldClass =
  "h-12 w-full rounded-2xl border border-[#e7c7bc] bg-[#fffaf7] px-4 text-sm text-[#260909] outline-none transition focus:border-[#a43a24]";
const labelClass = "mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#6f574f]";
const errClass = "mt-1 block text-sm text-red-600";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

function resolveImageSrc(value?: string) {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  return `${BASE_URL}${value}`;
}

export default function ClotheForm({ item }: { item?: any }) {
  const router = useRouter();
  const isEditing = !!item;
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClothesFormData>({
    resolver: zodResolver(clothesSchema) as any,
    defaultValues: {
      name: item?.name || "",
      category: item?.category || "tops",
      size: item?.size || "",
      color: item?.color || "",
      price: item?.price || 0,
      discountedPrice: item?.discountedPrice ?? null,
      stock: item?.stock || 0,
      imageUrl: item?.imageUrl || "",
      description: item?.description || "",
      status: item?.status || "active",
    },
  });

  const onSubmit = (data: ClothesFormData) => {
    setError("");
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("category", data.category);
        formData.append("size", data.size);
        formData.append("color", data.color);
        formData.append("price", String(Number(data.price)));
        if (
          data.discountedPrice !== null &&
          data.discountedPrice !== undefined &&
          !Number.isNaN(Number(data.discountedPrice))
        ) {
          formData.append("discountedPrice", String(Number(data.discountedPrice)));
        }
        formData.append("stock", String(Number(data.stock)));
        formData.append("description", data.description || "");
        formData.append("status", data.status);

        if (data.imageUrl) {
          formData.append("imageUrl", data.imageUrl);
        }

        if (selectedFile) {
          formData.append("image", selectedFile);
        }

        const result = isEditing
          ? await handleUpdateClothe(item._id, formData)
          : await handleCreateClothe(formData);

        if (!result.success) {
          throw new Error(result.message || "Failed to save clothes item");
        }

        router.push("/dashboard/admin/clothes");
        router.refresh();
      } catch (err: any) {
        setError(err?.message || "Something went wrong");
      }
    });
  };

  return (
    <div className="w-full max-w-3xl">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 md:grid-cols-2">
        {error ? (
          <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="md:col-span-2">
          <label className={labelClass}>Name</label>
          <input {...register("name")} className={fieldClass} placeholder="Silk Blazer" />
          {errors.name ? <span className={errClass}>{errors.name.message}</span> : null}
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select {...register("category")} className={fieldClass}>
            <option value="tops">Tops</option>
            <option value="bottoms">Bottoms</option>
            <option value="shoes">Shoes</option>
            <option value="accessories">Accessories</option>
            <option value="dresses">Dresses</option>
            <option value="outerwear">Outerwear</option>
            <option value="shirts">Shirts</option>
            <option value="sweaters">Sweaters</option>
            <option value="pants">Pants</option>
            <option value="skirts">Skirts</option>
            <option value="activewear">Activewear</option>
          </select>
          {errors.category ? <span className={errClass}>{errors.category.message}</span> : null}
        </div>

        <div>
          <label className={labelClass}>Size</label>
          <input {...register("size")} className={fieldClass} placeholder="M / 32" />
          {errors.size ? <span className={errClass}>{errors.size.message}</span> : null}
        </div>

        <div>
          <label className={labelClass}>Color</label>
          <input {...register("color")} className={fieldClass} placeholder="Beige" />
          {errors.color ? <span className={errClass}>{errors.color.message}</span> : null}
        </div>

        <div>
          <label className={labelClass}>Price</label>
          <input type="number" min="0" step="0.01" {...register("price", { valueAsNumber: true })} className={fieldClass} />
          {errors.price ? <span className={errClass}>{errors.price.message}</span> : null}
        </div>

        <div>
          <label className={labelClass}>Discounted Price</label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Optional sale price"
            {...register("discountedPrice", { valueAsNumber: true })}
            className={fieldClass}
          />
          {errors.discountedPrice ? <span className={errClass}>{errors.discountedPrice.message}</span> : null}
        </div>

        <div>
          <label className={labelClass}>Stock</label>
          <input type="number" min="0" {...register("stock", { valueAsNumber: true })} className={fieldClass} />
          {errors.stock ? <span className={errClass}>{errors.stock.message}</span> : null}
        </div>

        <div className="md:col-span-2">
          <div className="mb-4 flex items-center gap-4">
            {previewImage ? (
              <Image
                src={previewImage}
                alt="Preview"
                width={96}
                height={96}
                unoptimized
                className="h-24 w-24 rounded-2xl object-cover"
              />
            ) : resolveImageSrc(item?.imageUrl) ? (
              <Image
                src={resolveImageSrc(item?.imageUrl)!}
                alt={item?.name || "Clothes preview"}
                width={96}
                height={96}
                unoptimized
                className="h-24 w-24 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#fff6f2] text-xs font-bold text-[#9a7e74]">
                No Image
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-[#311812]">Product image</p>
              <p className="mt-1 text-xs text-[#6f574f]">Upload a clothing photo for the catalog.</p>
            </div>
          </div>
          <label className={labelClass}>Image upload</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setImageError("");
              
              if (file) {
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                  setImageError("Image must be less than 5MB");
                  setPreviewImage(null);
                  setSelectedFile(null);
                  return;
                }

                // Validate file type
                const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
                if (!validTypes.includes(file.type)) {
                  setImageError("Only JPG, PNG, and WebP images are allowed");
                  setPreviewImage(null);
                  setSelectedFile(null);
                  return;
                }

                // Show preview
                setSelectedFile(file);
                const reader = new FileReader();
                reader.onloadend = () => setPreviewImage(reader.result as string);
                reader.readAsDataURL(file);
              } else {
                setPreviewImage(null);
                setSelectedFile(null);
              }
            }}
            className="w-full text-sm text-[#6f574f] file:mr-3 file:rounded-full file:border-0 file:bg-[#a43a24] file:px-4 file:py-2 file:text-xs file:font-bold file:text-white"
          />
          {imageError && <span className="mt-1 block text-sm text-red-600">{imageError}</span>}
          <input type="hidden" {...register("imageUrl")} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea
            {...register("description")}
            rows={4}
            className="min-h-28 w-full rounded-2xl border border-[#e7c7bc] bg-[#fffaf7] px-4 py-3 text-sm text-[#260909] outline-none transition focus:border-[#a43a24]"
            placeholder="Short product description"
          />
          {errors.description ? <span className={errClass}>{errors.description.message}</span> : null}
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
            onClick={() => router.push("/dashboard/admin/clothes")}
            className="rounded-full border border-[#e7c7bc] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#6f574f] transition hover:bg-[#fff6f2]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isPending}
            className="rounded-full bg-[#a43a24] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#8f3120] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Saving..." : isEditing ? "Save changes" : "Create item"}
          </button>
        </div>
      </form>
    </div>
  );
}
