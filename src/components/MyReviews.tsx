"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, Edit, Trash2, Package } from "lucide-react";
import { handleGetMyReviews, handleUpdateReview, handleDeleteReview } from "@/lib/actions/review-action";
import { StarRating } from "./StarRating";
import { ReviewModal } from "./ReviewModal";
import { formatMoney } from "@/lib/pricing";
import { resolveApiImageUrl } from "@/lib/image-url";

type Review = {
  _id: string;
  clotheId: string;
  rating: number;
  title?: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
  clothe?: {
    name: string;
    imageUrl?: string;
    price: number;
    category?: string;
  };
};

export function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const result = await handleGetMyReviews();
      if (result.success && result.data) {
        setReviews(result.data);
      } else {
        setError(result.message || "Failed to load reviews");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    void loadReviews();
  }, []);

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const result = await handleDeleteReview(reviewId);
      if (result.success) {
        setReviews(reviews.filter((r) => r._id !== reviewId));
      } else {
        setError(result.message || "Failed to delete review");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to delete review");
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setEditModalOpen(true);
  };

  const handleUpdate = async (rating: number, title: string, comment: string) => {
    if (!editingReview) return;

    try {
      const result = await handleUpdateReview(editingReview._id, {
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
      });

      if (result.success) {
        setReviews(
          reviews.map((r) =>
            r._id === editingReview._id
              ? { ...r, rating, title, comment }
              : r
          )
        );
        setEditModalOpen(false);
        setEditingReview(null);
      } else {
        setError(result.message || "Failed to update review");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to update review");
    }
  };

  const resolveImage = (value?: string) => {
    return resolveApiImageUrl(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-[#820000] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[#E7B8B8] bg-white p-8 text-center">
        <Package className="mx-auto h-12 w-12 text-[#820000] mb-4" />
        <h2 className="text-xl font-bold text-[#260909] mb-2">Error Loading Reviews</h2>
        <p className="text-[#735656]">{error}</p>
        <button
          type="button"
          onClick={loadReviews}
          className="mt-4 rounded-2xl bg-[#820000] px-6 py-2 font-bold text-white hover:bg-[#A41515] transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E7B8B8] bg-white p-8 text-center">
        <Star className="mx-auto h-16 w-16 text-[#820000] mb-4 opacity-50" />
        <h2 className="text-2xl font-bold text-[#260909] mb-2">No Reviews Yet</h2>
        <p className="text-[#735656] mb-4">You haven&apos;t written any reviews yet. Start shopping and share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#260909]">My Reviews</h2>
        <p className="text-[#735656] mt-1">Manage your product reviews</p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => {
          const image = resolveImage(review.clothe?.imageUrl);
          return (
            <div
              key={review._id}
              className="rounded-2xl border border-[#E7B8B8] bg-white overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Product Image */}
                <div className="relative h-48 md:h-auto md:w-48 bg-[#FFF7F7]">
                  {image ? (
                    <Image
                      src={image}
                      alt={review.clothe?.name || "Product"}
                      fill
                      sizes="192px"
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-semibold text-[#735656]">
                      No image
                    </div>
                  )}
                </div>

                {/* Review Content */}
                <div className="flex-1 p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#260909]">
                        {review.clothe?.name || "Product"}
                      </h3>
                      {review.clothe?.category && (
                        <p className="text-sm text-[#735656]">{review.clothe.category}</p>
                      )}
                      {review.clothe?.price && (
                        <p className="text-sm font-bold text-[#820000] mt-1">
                          {formatMoney(review.clothe.price)}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(review)}
                        className="rounded-full border border-[#E7B8B8] bg-[#FFF7F7] p-2 text-[#820000] hover:bg-[#FFECEC] transition"
                        title="Edit review"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(review._id)}
                        className="rounded-full border border-[#E7B8B8] bg-[#FFF7F7] p-2 text-[#820000] hover:bg-[#FFDADA] transition"
                        title="Delete review"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StarRating rating={review.rating} size={16} />
                    <span className="text-xs text-[#735656]">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    {review.verifiedPurchase && (
                      <span className="rounded-full bg-[#820000] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  {review.title && (
                    <h4 className="font-bold text-[#260909]">{review.title}</h4>
                  )}

                  <p className="text-sm text-[#735656] leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Review Modal */}
      {editingReview && (
        <ReviewModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingReview(null);
          }}
          clotheId={editingReview.clotheId}
          clotheName={editingReview.clothe?.name || "Product"}
          isEdit={true}
          initialRating={editingReview.rating}
          initialTitle={editingReview.title}
          initialComment={editingReview.comment}
          onSuccess={() => {
            handleUpdate(
              editingReview.rating,
              editingReview.title || "",
              editingReview.comment
            );
          }}
        />
      )}
    </div>
  );
}
