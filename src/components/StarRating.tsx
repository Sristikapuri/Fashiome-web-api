"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
  showCount?: boolean;
  reviewCount?: number;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 16,
  readonly = true,
  onRatingChange,
  showCount = false,
  reviewCount,
}: StarRatingProps) {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => {
        const isFilled = star <= rating;
        const isHalfFilled = star - 0.5 === rating;

        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onRatingChange?.(star)}
            className={`transition-colors ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
          >
            <Star
              size={size}
              className={
                isFilled
                  ? "fill-[#FFD700] text-[#FFD700]"
                  : isHalfFilled
                  ? "fill-[#FFD700]/50 text-[#FFD700]"
                  : "fill-gray-200 text-gray-200"
              }
            />
          </button>
        );
      })}
      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-[#735656] ml-1">({reviewCount})</span>
      )}
    </div>
  );
}
