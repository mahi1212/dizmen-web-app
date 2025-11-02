'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, ChevronRight } from 'lucide-react';
import { mockMenus, mockRestaurants } from '@/lib/mock-data';
import { isMenuAvailableNow } from '@/lib/helpers';
import MenuItemsManager from '@/components/dashboard/menu-items-manager';

export default function MenuItemsViewPage() {
  const params = useParams();
  const router = useRouter();
  const menuId = params.menuId as string;

  const menu = mockMenus.find(m => m.id === menuId);
  const restaurant = mockRestaurants.find(r => r.id === menu?.restaurantId);

  if (!menu) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Menu Not Found</CardTitle>
            <CardDescription>The menu you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const menuAvailable = isMenuAvailableNow(menu);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm overflow-x-auto">
              <button
                onClick={() => router.push('/dashboard?tab=restaurant')}
                className="text-gray-600 hover:text-gray-900 font-medium whitespace-nowrap transition-colors"
              >
                {restaurant?.name || 'Restaurant'}
              </button>
              <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <button
                onClick={() => router.push('/dashboard?tab=menus')}
                className="text-gray-600 hover:text-gray-900 font-medium whitespace-nowrap transition-colors"
              >
                Menus
              </button>
              <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="flex items-center gap-1">
                {menu.icon && <span className="text-lg">{menu.icon}</span>}
                <span className="text-orange-600 font-semibold whitespace-nowrap">{menu.name}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {menu.icon && <span className="text-3xl">{menu.icon}</span>}
                  <CardTitle className="text-2xl">{menu.name}</CardTitle>
                </div>
                <CardDescription className="text-base">{menu.description}</CardDescription>
              </div>
              <div className="flex flex-col gap-2">
                <Badge variant={menu.isActive ? 'default' : 'secondary'} className="w-fit">
                  {menu.isActive ? 'Active' : 'Hidden'}
                </Badge>
                {menu.timeRanges && menu.timeRanges.length > 0 && (
                  <Badge variant={menuAvailable ? 'default' : 'secondary'} className="w-fit">
                    <Clock className="h-3 w-3 mr-1" />
                    {menuAvailable ? 'Available now' : 'Not available now'}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          {menu.timeRanges && menu.timeRanges.length > 0 && (
            <CardContent className="pt-0">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-2">Schedule:</h3>
                <div className="space-y-1">
                  {menu.timeRanges.map((range, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {range.startTime} - {range.endTime}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Reusable MenuItemsManager Component */}
        <MenuItemsManager 
          filterByMenuId={menuId}
          hideFilter={true}
          hideHeader={false}
        />
      </div>
    </div>
  );
}


