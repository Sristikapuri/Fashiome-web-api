"use client";

import { useState, useEffect } from "react";
import { X, Star, Package, MapPin, Truck, CreditCard } from "lucide-react";
import { handleGetReviewsByClothe } from "@/lib/actions/review-action";
import { StarRating } from "./StarRating";
import { ReviewModal } from "./ReviewModal";
import { formatMoney } from "@/lib/pricing";
import Image from "next/image";
import { resolveApiImageUrl } from "@/lib/image-url";

interface ProductDetailModalProps {
  open: boolean;
  onClose: () => void;
  product: {
    _id: string;
    name: string;
    category: string;
    color: string;
    size: string;
    price: number;
    discountedPrice?: number | null;
    stock: number;
    imageUrl?: string;
    description?: string;
  };
  addToBag?: (product: any) => void;
}

export function ProductDetailModal({ open, onClose, product, addToBag }: ProductDetailModalProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  useEffect(() => {
    if (open && product._id) {
      // Loading reviews is an external synchronization triggered by the modal.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoadingReviews(true);
      handleGetReviewsByClothe(product._id).then((result) => {
        if (result.success && result.data) {
          setReviews(result.data.reviews || []);
          setReviewStats(result.data.stats || { averageRating: 0, totalReviews: 0 });
        }
        setLoadingReviews(false);
      });
    }
  }, [open, product._id]);

  const resolveImage = (value?: string) => {
    return resolveApiImageUrl(value);
  };

  const image = resolveImage(product.imageUrl);
  const hasDiscount = product.discountedPrice !== null && product.discountedPrice !== undefined;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-[#260909] px-6 py-4">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E7B8B8]">
              Product Details
            </p>
            <h2 className="mt-0.5 text-xl font-black text-white">{product.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Product Image */}
            <div className="relative h-80 md:h-96 rounded-2xl bg-[#FFF7F7] overflow-hidden">
              {image ? (
                <Image src={image} alt={product.name} fill unoptimized className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-semibold text-[#735656]">
                  No image
                </div>
              )}
              {hasDiscount && (
                <span className="absolute left-3 top-3 rounded-full bg-[#820000] px-3 py-1 text-xs font-bold text-white shadow">
                  SALE
                </span>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              {/* Rating */}
              {reviewStats.totalReviews > 0 && (
                <div className="flex items-center gap-3">
                  <StarRating 
                    rating={reviewStats.averageRating} 
                    size={20}
                    showCount={true}
                    reviewCount={reviewStats.totalReviews}
                  />
                </div>
              )}

              {/* Category & Details */}
              <div className="flex items-center gap-2 text-sm text-[#735656]">
                <span className="font-bold text-[#820000]">{product.category}</span>
                <span>•</span>
                <span>{product.color}</span>
                <span>•</span>
                <span>{product.size}</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                {hasDiscount && product.discountedPrice ? (
                  <>
                    <p className="text-2xl font-black text-[#820000]">
                      {formatMoney(product.discountedPrice)}
                    </p>
                    <p className="text-lg font-bold text-[#9A7E74] line-through">
                      {formatMoney(product.price)}
                    </p>
                  </>
                ) : (
                  <p className="text-2xl font-black text-[#260909]">
                    {formatMoney(product.price)}
                  </p>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#820000]" />
                <span className="text-sm font-semibold text-[#260909]">
                  {product.stock} in stock
                </span>
              </div>

              {/* Description */}
              <div className="rounded-2xl bg-[#FFF7F7] p-4">
                <h3 className="font-bold text-[#260909] mb-2">Description</h3>
                <p className="text-sm text-[#735656] leading-relaxed">
                  {product.description || "Styled for the catalog and ready to shop."}
                </p>
              </div>

              {/* Add to Bag */}
              {addToBag && (
                <button
                  type="button"
                  onClick={() => addToBag(product)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#820000] px-6 py-4 font-bold text-white transition hover:bg-[#A41515]"
                >
                  <Package className="h-5 w-5" />
                  Add to Bag
                </button>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-8 border-t border-[#E7B8B8] pt-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#260909]">Customer Reviews</h3>
                {reviewStats.totalReviews > 0 && (
                  <p className="text-sm text-[#735656] mt-1">
                    {reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setReviewModalOpen(true)}
                className="rounded-2xl border border-[#E7B8B8] bg-[#FFF7F7] px-4 py-2 text-sm font-bold text-[#820000] hover:bg-[#FFECEC] transition"
              >
                Write a Review
              </button>
            </div>

            {loadingReviews ? (
              <div className="text-center py-8 text-[#735656]">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 rounded-2xl bg-[#FFF7F7]">
                <Star className="mx-auto h-12 w-12 text-[#E7B8B8] mb-3" />
                <p className="text-[#735656]">No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="rounded-2xl border border-[#E7B8B8] bg-[#FFF7F7] p-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#820000] flex items-center justify-center text-white font-bold">
                          {(review.user?.firstName?.[0] || "U")}
                        </div>
                        <div>
                          <p className="font-bold text-[#260909]">
                            {review.user?.firstName || "User"} {review.user?.lastName || ""}
                          </p>
                          <StarRating rating={review.rating} size={14} />
                        </div>
                      </div>
                      <p className="text-xs text-[#735656]">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {review.title && (
                      <h4 className="font-bold text-[#260909] mb-2">{review.title}</h4>
                    )}
                    <p className="text-sm text-[#735656] leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Review Modal */}
        <ReviewModal
          open={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          clotheId={product._id}
          clotheName={product.name}
          onSuccess={() => {
            // Reload reviews
            handleGetReviewsByClothe(product._id).then((result) => {
              if (result.success && result.data) {
                setReviews(result.data.reviews || []);
                setReviewStats(result.data.stats || { averageRating: 0, totalReviews: 0 });
              }
            });
          }}
        />
      </div>
    </div>
  );
}
