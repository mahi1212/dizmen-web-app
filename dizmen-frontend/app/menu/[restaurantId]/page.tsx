'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockRestaurants, mockMenuItems, mockMenus } from '@/lib/mock-data';
import { MenuItem, Restaurant, Menu } from '@/lib/types';
import { isMenuAvailableNow } from '@/lib/helpers';
import { MapPin, Phone, Globe, ExternalLink } from 'lucide-react';
import VerificationWarningBanner from '@/components/dashboard/verification-warning-banner';

// Lazy load dialog for code splitting
const ItemDetailDialog = lazy(() => import('@/components/dashboard/modals/item-detail-dialog'));

export default function MenuPage() {
  const params = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      const activeMenuIds = activeMenus.map(m => m.id);
      const items = mockMenuItems.filter(
        item => item.restaurantId === rest.id 
          && activeMenuIds.includes(item.menuId)
          && item.isAvailable
      );
      setMenuItems(items);
    } else {
      // Check localStorage for newly created restaurants
      const restaurantKeys = Object.keys(localStorage).filter(key => key.startsWith('restaurant-'));
      for (const key of restaurantKeys) {
        const savedRestaurant = JSON.parse(localStorage.getItem(key) || '{}');
        if (savedRestaurant.qrCode === params.restaurantId) {
          setRestaurant(savedRestaurant);
          break;
        }
      }
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

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
  };

  const handleCloseItemDialog = () => {
    setSelectedItem(null);
    setCurrentImageIndex(0);
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
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header - Compact & Modern */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto">
          {/* Profile Image Banner */}
          {restaurant.profileImage && (
            <div className="w-full h-full sm:h-40 overflow-hidden">
              <img
                src={restaurant.profileImage}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Restaurant Info */}
          <div className="px-4 py-3">
            <h1 className="text-xl font-bold text-gray-900">{restaurant.name}</h1>
            {restaurant.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{restaurant.description}</p>
            )}
            
            {/* Quick Info Icons */}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
              {restaurant.address && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="line-clamp-1">{restaurant.address}</span>
                </div>
              )}
              {restaurant.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  <a href={`tel:${restaurant.phone}`} className="hover:text-orange-600">
                    {restaurant.phone}
                  </a>
                </div>
              )}
            </div>
            
            {/* Action Links */}
            {(restaurant.website || restaurant.googleLocationUrl || (restaurant.socialMediaLinks && restaurant.socialMediaLinks.length > 0)) && (
              <div className="flex flex-wrap gap-2 mt-3">
                {restaurant.website && (
                  <a
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors"
                  >
                    <Globe className="h-3 w-3" />
                    Website
                  </a>
                )}
                {restaurant.googleLocationUrl && (
                  <a
                    href={restaurant.googleLocationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors"
                  >
                    <MapPin className="h-3 w-3" />
                    Directions
                  </a>
                )}
                {restaurant.socialMediaLinks && restaurant.socialMediaLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {link.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Verification Warning */}
        {restaurant.verificationStatus === 'blocked' && (
          <div className="mb-4">
            <VerificationWarningBanner restaurant={restaurant} />
          </div>
        )}

        {menus.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500">No menus available at this time.</p>
              <p className="text-sm text-gray-400 mt-2">Please check back later!</p>
            </CardContent>
          </Card>
        ) : menus.length === 1 ? (
          // Single Menu - Direct Display
          <div className="space-y-3">
            {Object.entries(groupItemsByCategory(getMenuItems(menus[0].id))).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-3 sticky top-[180px] sm:top-[200px] bg-gray-50 py-2 z-40">
                  <h2 className="text-lg font-bold text-gray-900">{category}</h2>
                  <Badge variant="secondary" className="text-xs">
                    {items.length} items
                  </Badge>
                </div>
                <div className="space-y-3">
                  {items.map((item) => (
                    <Card
                      key={item.id}
                      className="overflow-hidden hover:shadow-lg transition-all duration-200 active:scale-98 cursor-pointer"
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="flex gap-3 p-3">
                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                              {item.name}
                            </h3>
                            <span className="text-sm font-bold text-orange-600 flex-shrink-0">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                          
                          {/* View Button */}
                          <div className="flex items-center justify-end mt-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleItemClick(item);
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                        
                        {/* Item Image - Right Side */}
                        {item.images && item.images.length > 0 && (
                          <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Multiple Menus - Tabs
          <Tabs defaultValue={menus[0]?.id} className="space-y-4">
            <TabsList className="w-full h-auto grid gap-1 p-1 bg-white rounded-lg shadow-sm" style={{ gridTemplateColumns: `repeat(${Math.min(menus.length, 4)}, 1fr)` }}>
              {menus.map((menu) => (
                <TabsTrigger
                  key={menu.id}
                  value={menu.id}
                  className="flex flex-col items-center gap-1 py-2 text-xs data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600"
                >
                  {menu.icon && <span className="text-lg">{menu.icon}</span>}
                  <span className="font-medium truncate max-w-full">{menu.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {menus.map((menu) => {
              const menuItemsFiltered = getMenuItems(menu.id);
              return (
                <TabsContent key={menu.id} value={menu.id} className="space-y-3 mt-4">
                  {menuItemsFiltered.length === 0 ? (
                    <Card className="text-center py-12">
                      <CardContent>
                        <p className="text-gray-500">No items available in this menu right now.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    Object.entries(groupItemsByCategory(menuItemsFiltered)).map(([category, items]) => (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-3 sticky top-[180px] sm:top-[200px] bg-gray-50 py-2 z-40">
                          <h2 className="text-lg font-bold text-gray-900">{category}</h2>
                          <Badge variant="secondary" className="text-xs">
                            {items.length} items
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          {items.map((item) => (
                            <Card
                              key={item.id}
                              className="overflow-hidden hover:shadow-lg transition-all duration-200 active:scale-98 cursor-pointer"
                              onClick={() => handleItemClick(item)}
                            >
                              <div className="flex gap-3 p-3">
                                {/* Item Details */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                                      {item.name}
                                    </h3>
                                    <span className="text-sm font-bold text-orange-600 flex-shrink-0">
                                      ${item.price.toFixed(2)}
                                    </span>
                                  </div>
                                  
                                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                    {item.description}
                                  </p>
                                  
                                  {/* View Button */}
                                  <div className="flex items-center justify-end mt-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleItemClick(item);
                                      }}
                                    >
                                      View Details
                                    </Button>
                                  </div>
                                </div>
                                
                                {/* Item Image - Right Side */}
                                {item.images && item.images.length > 0 && (
                                  <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                    <img
                                      src={item.images[0]}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                              </div>
                            </Card>
                          ))}
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

      {/* Lazy loaded dialog */}
      {selectedItem && (
        <Suspense fallback={<div />}>
          <ItemDetailDialog
            item={selectedItem}
            isOpen={!!selectedItem}
            onClose={handleCloseItemDialog}
            currentImageIndex={currentImageIndex}
            onNextImage={nextImage}
            onPrevImage={prevImage}
          />
        </Suspense>
      )}
    </div>
  );
}
