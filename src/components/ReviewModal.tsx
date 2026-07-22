"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";
import { handleCreateReview, handleUpdateReview } from "@/lib/actions/review-action";
import { StarRating } from "./StarRating";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  clotheId: string;
  clotheName: string;
  onSuccess?: () => void;
  initialRating?: number;
  initialTitle?: string;
  initialComment?: string;
  isEdit?: boolean;
}

export function ReviewModal({ 
  open, 
  onClose, 
  clotheId, 
  clotheName, 
  onSuccess, 
  initialRating = 0, 
  initialTitle = "", 
  initialComment = "",
  isEdit = false 
}: ReviewModalProps) {
  const [rating, setRating] = useState(initialRating);
  const [title, setTitle] = useState(initialTitle);
  const [comment, setComment] = useState(initialComment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      setError("Please write a review");
      return;
    }

    setLoading(true);
    try {
      let result;
      if (isEdit) {
        result = await handleUpdateReview(clotheId, {
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
        });
      } else {
        result = await handleCreateReview({
          clotheId,
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
        });
      }

      if (result.success) {
        setRating(0);
        setTitle("");
        setComment("");
        onSuccess?.();
        onClose();
      } else {
        setError(result.message || "Failed to submit review");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-[#260909] px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E7B8B8]">
              {isEdit ? "Edit Review" : "Write a Review"}
            </p>
            <h2 className="mt-0.5 text-xl font-black text-white">{clotheName}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-bold text-[#260909] mb-3">
              Rating *
            </label>
            <StarRating
              rating={rating}
              size={24}
              readonly={false}
              onRatingChange={setRating}
            />
            <p className="text-xs text-[#735656] mt-2">
              {rating === 0 ? "Select a rating" : `${rating} star${rating !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Title (Optional) */}
          <div>
            <label className="block text-sm font-bold text-[#260909] mb-2">
              Review Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              maxLength={100}
              className="w-full rounded-xl border border-[#E7B8B8] bg-[#FFF7F7] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#820000]/20"
            />
            <p className="text-xs text-[#735656] mt-1 text-right">
              {title.length}/100
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-bold text-[#260909] mb-2">
              Your Review *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              rows={4}
              maxLength={1000}
              required
              className="w-full rounded-xl border border-[#E7B8B8] bg-[#FFF7F7] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#820000]/20 resize-none"
            />
            <p className="text-xs text-[#735656] mt-1 text-right">
              {comment.length}/1000
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-[#FFDADA] bg-[#FFDADA] px-4 py-3 text-sm text-[#4A0000]">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#820000] px-6 py-3 font-bold text-white hover:bg-[#A41515] transition disabled:cursor-not-allowed disabled:bg-[#7f6767]"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
