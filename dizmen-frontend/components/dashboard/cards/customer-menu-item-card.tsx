'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, DollarSign } from 'lucide-react';
import { MenuItem, Review } from '@/lib/types';
import { formatPrice, calculateAverageRating } from '@/lib/helpers';

interface CustomerMenuItemCardProps {
  item: MenuItem;
  reviews: Review[];
  onClick: (item: MenuItem) => void;
}

export default function CustomerMenuItemCard({
  item,
  reviews,
  onClick,
}: CustomerMenuItemCardProps) {
  const avgRating = calculateAverageRating(reviews);

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden p-0 gap-0"
      onClick={() => onClick(item)}
    >
      <div className="relative h-40 sm:h-48 w-full">
        {item.images && item.images.length > 0 ? (
          <>
            <img
              src={item.images[0]}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {item.images.length > 1 && (
              <Badge className="absolute top-2 right-2" variant="secondary">
                {item.images.length} photos
              </Badge>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-gray-500 text-sm font-medium">No Image Available</p>
            </div>
          </div>
        )}
      </div>
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-base sm:text-lg">{item.name}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm">
          {item.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center text-lg sm:text-xl font-bold text-orange-600">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
            {formatPrice(item.price).replace('$', '')}
          </div>
          {reviews.length > 0 && (
            <div className="flex items-center space-x-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{avgRating}</span>
              <span className="text-gray-500">({reviews.length})</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

