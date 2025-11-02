'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, DollarSign, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { MenuItem, Review } from '@/lib/types';
import { formatPrice } from '@/lib/helpers';

interface ItemDetailDialogProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  currentImageIndex: number;
  onNextImage: () => void;
  onPrevImage: () => void;
  reviews: Review[];
  onWriteReview: () => void;
}

export default function ItemDetailDialog({
  item,
  isOpen,
  onClose,
  currentImageIndex,
  onNextImage,
  onPrevImage,
  reviews,
  onWriteReview,
}: ItemDetailDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {item.images && item.images.length > 0 && (
          <div className="relative w-full h-64 sm:h-80 overflow-hidden rounded-t-lg">
            <img
              src={item.images[currentImageIndex]}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {item.images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute left-2 top-1/2 -translate-y-1/2"
                  onClick={(e) => { e.stopPropagation(); onPrevImage(); }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={(e) => { e.stopPropagation(); onNextImage(); }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                  {item.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 w-2 rounded-full ${
                        idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        <div className="p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">{item.name}</DialogTitle>
            <DialogDescription className="flex items-center space-x-2 flex-wrap gap-2">
              <span className="text-xl sm:text-2xl font-bold text-orange-600">
                {formatPrice(item.price)}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-2">Description</h3>
            <p className="text-gray-700 text-sm sm:text-base">{item.description}</p>
          </div>
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
              <h3 className="font-semibold text-base sm:text-lg">Customer Reviews</h3>
              <Button size="sm" onClick={onWriteReview} className="w-full sm:w-auto">
                <MessageSquare className="h-4 w-4 mr-2" />
                Write Review
              </Button>
            </div>
            {reviews.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <span className="font-semibold text-sm">{review.customerId}</span>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4 text-sm">
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

