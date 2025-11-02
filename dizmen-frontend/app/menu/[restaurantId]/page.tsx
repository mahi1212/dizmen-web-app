'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockRestaurants, mockMenuItems, mockMenus, mockReviews } from '@/lib/mock-data';
import { MenuItem, Review, Restaurant, Menu } from '@/lib/types';
import { isMenuAvailableNow } from '@/lib/helpers';
import { toast } from 'sonner';
import CustomerMenuItemCard from '@/components/dashboard/cards/customer-menu-item-card';

// Lazy load dialogs for code splitting
const ItemDetailDialog = lazy(() => import('@/components/dashboard/modals/item-detail-dialog'));
const ReviewDialog = lazy(() => import('@/components/dashboard/modals/review-dialog'));

export default function MenuPage() {
  const params = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  useEffect(() => {
    const rest = mockRestaurants.find(r => r.qrCode === params.restaurantId);
    if (rest) {
      setRestaurant(rest);
      // Filter menus: active AND available based on time
      const activeMenus = mockMenus
        .filter(m => m.restaurantId === rest.id && m.isActive && isMenuAvailableNow(m))
        .sort((a, b) => a.order - b.order);
      setMenus(activeMenus);
      
      // Filter items: item is available AND belongs to an active menu
      // Time is checked via menu, not individual items
      const activeMenuIds = activeMenus.map(m => m.id);
      const items = mockMenuItems.filter(
        item => item.restaurantId === rest.id 
          && activeMenuIds.includes(item.menuId)  // Item belongs to an active menu
          && item.isAvailable  // Item toggle is ON
      );
      setMenuItems(items);
    }
  }, [params.restaurantId]);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Restaurant Not Found</CardTitle>
            <CardDescription>The menu you're looking for doesn't exist.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const getItemReviews = (itemId: string) => {
    return reviews.filter(r => r.menuItemId === itemId);
  };

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
  };

  const handleCloseItemDialog = () => {
    setSelectedItem(null);
    setCurrentImageIndex(0);
  };

  const handleOpenReview = (item: MenuItem) => {
    setSelectedItem(item);
    setShowReviewDialog(true);
  };

  const handleReviewSubmit = (review: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}`,
      createdAt: new Date(),
    };
    setReviews([...reviews, newReview]);
    setShowReviewDialog(false);
    setSelectedItem(null);
    toast.success('Review submitted!', {
      description: 'Thank you for your feedback',
    });
  };

  const nextImage = () => {
    if (selectedItem && selectedItem.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedItem.images.length);
    }
  };

  const prevImage = () => {
    if (selectedItem && selectedItem.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedItem.images.length - 1 : prev - 1
      );
    }
  };

  const handleWriteReview = () => {
    setShowReviewDialog(true);
  };

  const getMenuItems = (menuId: string) => {
    return menuItems.filter(item => item.menuId === menuId);
  };

  const groupItemsByCategory = (items: MenuItem[]) => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{restaurant.name}</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">{restaurant.description}</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-4 mt-3 text-sm text-gray-500">
            <span className="truncate">{restaurant.address}</span>
            <span className="hidden sm:inline">•</span>
            <span>{restaurant.phone}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
        {menus.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No menus available at this time.</p>
              <p className="text-sm text-gray-400 mt-2">Please check back later!</p>
            </CardContent>
          </Card>
        ) : menus.length === 1 ? (
          <div className="space-y-6">
            {Object.entries(groupItemsByCategory(getMenuItems(menus[0].id))).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  {category}
                  <Badge variant="secondary" className="ml-3">
                    {items.length}
                  </Badge>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {items.map((item) => {
                    const itemReviews = getItemReviews(item.id);
                    return (
                      <CustomerMenuItemCard
                        key={item.id}
                        item={item}
                        reviews={itemReviews}
                        onClick={handleItemClick}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Tabs defaultValue={menus[0]?.id} className="space-y-4">
            <TabsList className="grid w-full h-auto" style={{ gridTemplateColumns: `repeat(${Math.min(menus.length, 3)}, 1fr)` }}>
              {menus.map((menu) => (
                <TabsTrigger 
                  key={menu.id} 
                  value={menu.id}
                  className="text-xs sm:text-sm py-2 sm:py-3 flex flex-col sm:flex-row items-center gap-1 sm:gap-2"
                >
                  {menu.icon && <span className="text-base sm:text-lg">{menu.icon}</span>}
                  <span className="truncate">{menu.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {menus.map((menu) => {
              const menuItemsFiltered = getMenuItems(menu.id);
              return (
                <TabsContent key={menu.id} value={menu.id} className="space-y-6">
                  {menuItemsFiltered.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <p className="text-gray-500">No items available in this menu right now.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    Object.entries(groupItemsByCategory(menuItemsFiltered)).map(([category, items]) => (
                      <div key={category}>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center">
                          {category}
                          <Badge variant="secondary" className="ml-3">
                            {items.length}
                          </Badge>
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {items.map((item) => {
                            const itemReviews = getItemReviews(item.id);
                            return (
                              <CustomerMenuItemCard
                                key={item.id}
                                item={item}
                                reviews={itemReviews}
                                onClick={handleItemClick}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </div>

      {/* Lazy loaded dialogs */}
      {selectedItem && !showReviewDialog && (
        <Suspense fallback={<div />}>
          <ItemDetailDialog
            item={selectedItem}
            isOpen={!!selectedItem}
            onClose={handleCloseItemDialog}
            currentImageIndex={currentImageIndex}
            onNextImage={nextImage}
            onPrevImage={prevImage}
            reviews={getItemReviews(selectedItem.id)}
            onWriteReview={handleWriteReview}
          />
        </Suspense>
      )}

      {showReviewDialog && selectedItem && (
        <Suspense fallback={<div />}>
          <ReviewDialog
            item={selectedItem}
            onClose={() => {
              setShowReviewDialog(false);
              setSelectedItem(null);
            }}
            onSubmit={handleReviewSubmit}
          />
        </Suspense>
      )}
    </div>
  );
}
