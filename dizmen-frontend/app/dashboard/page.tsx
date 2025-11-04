'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, LogOut } from 'lucide-react';
import { LazyMenusTab, LazyItemsTab, LazyRestaurantTab, LazyQRCodeTab } from '@/components/dashboard/lazy-tabs';
import OnboardingFlow from '@/components/dashboard/onboarding-flow';
import { mockRestaurants } from '@/lib/mock-data';
import { Restaurant } from '@/lib/types';

function DashboardContent() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentTab, setCurrentTab] = useState('menus');
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'restaurant_authority')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    // Redirect to onboarding if user doesn't have a restaurant
    if (user && user.role === 'restaurant_authority' && !user.restaurantId) {
      router.push('/restaurant-onboarding');
    }
  }, [user, router]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setCurrentTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    // Load restaurant data for the current user
    if (user?.restaurantId) {
      const rest = mockRestaurants.find(r => r.id === user.restaurantId);
      if (rest) {
        setRestaurant(rest);
      } else {
        // Restaurant not found in mock data - create a temporary restaurant object
        // All restaurants are automatically active when created
        setRestaurant({
          id: user.restaurantId,
          name: 'Your Restaurant',
          description: 'Restaurant description',
          address: 'Address on file',
          ownerId: user.id,
          createdAt: new Date(),
          qrCode: user.restaurantId,
          verificationStatus: 'verified',
          onboardingStep: 'complete',
        });
      }
    }
  }, [user]);

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleOnboardingComplete = (updatedRestaurant: Restaurant) => {
    setRestaurant(updatedRestaurant);
    // In a real app, save to backend here
  };

  // Show onboarding only if restaurant onboarding is not complete
  const showOnboarding = restaurant && restaurant.onboardingStep !== 'complete';

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <QrCode className="h-8 w-8 text-orange-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dizmen</h1>
                <p className="text-xs text-gray-500">Restaurant Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Show onboarding flow if needed */}
        {restaurant && showOnboarding ? (
          <OnboardingFlow 
            restaurant={restaurant} 
            onComplete={handleOnboardingComplete}
          />
        ) : (
          <>
            {/* Main Dashboard Tabs */}
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 max-w-2xl">
                <TabsTrigger value="menus">Menus</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
                <TabsTrigger value="qr">QR Code</TabsTrigger>
              </TabsList>

              <TabsContent value="menus" className="space-y-4">
                <LazyMenusTab value="menus" currentTab={currentTab} />
              </TabsContent>

              <TabsContent value="items" className="space-y-4">
                <LazyItemsTab value="items" currentTab={currentTab} />
              </TabsContent>

              <TabsContent value="restaurant">
                <LazyRestaurantTab value="restaurant" currentTab={currentTab} />
              </TabsContent>

              <TabsContent value="qr">
                <LazyQRCodeTab value="qr" currentTab={currentTab} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
