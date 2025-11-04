'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { LogOut, Shield } from 'lucide-react';
import AdminVerificationPanel from '@/components/dashboard/admin-verification-panel';
import { mockRestaurants } from '@/lib/mock-data';
import { Restaurant } from '@/lib/types';
import { toast } from 'sonner';

export default function AdminPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'super_admin')) {
      router.push('/');
      toast.error('Access denied. Admin privileges required.');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleBlock = (restaurantId: string, status: 'verified' | 'blocked', reason?: string) => {
    setRestaurants(prev => prev.map(r => 
      r.id === restaurantId 
        ? { 
            ...r, 
            verificationStatus: status,
            rejectionReason: status === 'blocked' ? reason : undefined,
          }
        : r
    ));
    // In a real app, save to backend here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-orange-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dizmen Admin</h1>
                <p className="text-xs text-gray-500">Super Admin Dashboard</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminVerificationPanel 
          restaurants={restaurants}
          onBlock={handleBlock}
        />
      </div>
    </div>
  );
}
