'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  CheckCircle, 
  ShieldOff, 
  Shield, 
  Building, 
  Phone, 
  MapPin,
  Calendar,
  User
} from 'lucide-react';
import { Restaurant } from '@/lib/types';
import { toast } from 'sonner';

interface AdminVerificationPanelProps {
  restaurants: Restaurant[];
  onBlock: (restaurantId: string, status: 'verified' | 'blocked', reason?: string) => void;
}

export default function AdminVerificationPanel({ restaurants, onBlock }: AdminVerificationPanelProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);

  const activeRestaurants = restaurants.filter(r => r.verificationStatus === 'verified');
  const blockedRestaurants = restaurants.filter(r => r.verificationStatus === 'blocked');

  const handleUnblock = (restaurantId: string) => {
    onBlock(restaurantId, 'verified');
    toast.success('Restaurant unblocked successfully!');
    setSelectedRestaurant(null);
  };

  const handleBlock = () => {
    if (!selectedRestaurant || !blockReason.trim()) {
      toast.error('Please provide a reason for blocking');
      return;
    }
    onBlock(selectedRestaurant.id, 'blocked', blockReason);
    toast.success('Restaurant blocked successfully');
    setIsBlockDialogOpen(false);
    setSelectedRestaurant(null);
    setBlockReason('');
  };

  const openBlockDialog = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsBlockDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Restaurant Management</h2>
          <p className="text-gray-500">Monitor and manage restaurant access</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {activeRestaurants.length} Active
          </Badge>
          <Badge variant="destructive" className="text-lg px-4 py-2">
            {blockedRestaurants.length} Blocked
          </Badge>
        </div>
      </div>

      {/* Active Restaurants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Restaurants</h3>
        {activeRestaurants.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">No active restaurants</p>
            </CardContent>
          </Card>
        ) : (
          activeRestaurants.map((restaurant) => (
            <Card key={restaurant.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Building className="h-6 w-6 text-orange-600" />
                    <div>
                      <CardTitle>{restaurant.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {restaurant.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-500">
                    <Shield className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Restaurant Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm font-medium">{restaurant.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium">{restaurant.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <User className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Owner ID</p>
                      <p className="text-sm font-medium">{restaurant.ownerId}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Created On</p>
                      <p className="text-sm font-medium">
                        {restaurant.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                    onClick={() => openBlockDialog(restaurant)}
                  >
                    <ShieldOff className="h-4 w-4 mr-2" />
                    Block Restaurant
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Blocked Restaurants */}
      {blockedRestaurants.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Blocked Restaurants</h3>
          {blockedRestaurants.map((restaurant) => (
            <Card key={restaurant.id} className="border-red-300 bg-red-50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Building className="h-6 w-6 text-red-600" />
                    <div>
                      <CardTitle>{restaurant.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {restaurant.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="destructive">
                    <ShieldOff className="h-3 w-3 mr-1" />
                    Blocked
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Restaurant Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm font-medium">{restaurant.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium">{restaurant.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <User className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Owner ID</p>
                      <p className="text-sm font-medium">{restaurant.ownerId}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Created On</p>
                      <p className="text-sm font-medium">
                        {restaurant.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Block Reason */}
                {restaurant.rejectionReason && (
                  <div className="p-3 bg-white rounded-lg border border-red-300">
                    <p className="text-xs text-gray-500 mb-1">Block Reason</p>
                    <p className="text-sm font-medium text-red-700">{restaurant.rejectionReason}</p>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex pt-4 border-t border-red-300">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleUnblock(restaurant.id)}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Unblock Restaurant
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Block Dialog */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block Restaurant</DialogTitle>
            <DialogDescription>
              Please provide a reason for blocking this restaurant. The restaurant owner will see this message and the QR code scanning will not work for customers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Block Reason *</Label>
              <Textarea
                id="reason"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="e.g., Policy violation, Fraudulent activity, etc."
                rows={4}
                className="mt-2"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsBlockDialogOpen(false);
                  setBlockReason('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleBlock}
                className="flex-1"
                disabled={!blockReason.trim()}
              >
                Confirm Block
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

