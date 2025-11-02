'use client';

import { lazy, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Lazy load components
const MenusManager = lazy(() => import('@/components/dashboard/menus-manager'));
const MenuItemsManager = lazy(() => import('@/components/dashboard/menu-items-manager'));
const RestaurantInfo = lazy(() => import('@/components/dashboard/restaurant-info'));
const QRCodeSection = lazy(() => import('@/components/dashboard/qr-code-section'));

// Loading fallback component
function TabLoading() {
  return (
    <Card>
      <CardContent className="py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface LazyTabContentProps {
  value: string;
  currentTab: string;
}

export function LazyMenusTab({ value, currentTab }: LazyTabContentProps) {
  if (value !== currentTab) return null;
  
  return (
    <Suspense fallback={<TabLoading />}>
      <MenusManager />
    </Suspense>
  );
}

export function LazyItemsTab({ value, currentTab }: LazyTabContentProps) {
  if (value !== currentTab) return null;
  
  return (
    <Suspense fallback={<TabLoading />}>
      <MenuItemsManager />
    </Suspense>
  );
}

export function LazyRestaurantTab({ value, currentTab }: LazyTabContentProps) {
  if (value !== currentTab) return null;
  
  return (
    <Suspense fallback={<TabLoading />}>
      <RestaurantInfo />
    </Suspense>
  );
}

export function LazyQRCodeTab({ value, currentTab }: LazyTabContentProps) {
  if (value !== currentTab) return null;
  
  return (
    <Suspense fallback={<TabLoading />}>
      <QRCodeSection />
    </Suspense>
  );
}

