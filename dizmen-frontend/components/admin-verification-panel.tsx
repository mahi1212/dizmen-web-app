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
  XCircle, 
  Clock, 
  FileText, 
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
  onVerify: (restaurantId: string, status: 'verified' | 'rejected', reason?: string) => void;
}

export default function AdminVerificationPanel({ restaurants, onVerify }: AdminVerificationPanelProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const pendingRestaurants = restaurants.filter(r => r.verificationStatus === 'pending');

  const handleVerify = (restaurantId: string) => {
    onVerify(restaurantId, 'verified');
    toast.success('Restaurant verified successfully!');
    setSelectedRestaurant(null);
  };

  const handleReject = () => {
    if (!selectedRestaurant || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    onVerify(selectedRestaurant.id, 'rejected', rejectionReason);
    toast.success('Restaurant verification rejected');
    setIsRejectDialogOpen(false);
    setSelectedRestaurant(null);
    setRejectionReason('');
  };

  const openRejectDialog = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsRejectDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Restaurant Verification</h2>
          <p className="text-gray-500">Review and verify pending restaurant applications</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {pendingRestaurants.length} Pending
        </Badge>
      </div>

      {pendingRestaurants.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-500">No pending verifications</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingRestaurants.map((restaurant) => (
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
                  <Badge className="bg-yellow-500">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
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
                      <p className="text-xs text-gray-500">Applied On</p>
                      <p className="text-sm font-medium">
                        {restaurant.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Verification Documents */}
                {restaurant.verificationDocuments && restaurant.verificationDocuments.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Verification Documents</Label>
                    <div className="space-y-2">
                      {restaurant.verificationDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-white border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium capitalize">
                                {doc.documentType.replace('_', ' ')}
                              </p>
                              <p className="text-xs text-gray-500">
                                Uploaded: {doc.uploadedAt.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                    onClick={() => openRejectDialog(restaurant)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleVerify(restaurant.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify Restaurant
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rejection Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Verification</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this restaurant's verification
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Rejection Reason *</Label>
              <Textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Incomplete documents, Invalid business license, etc."
                rows={4}
                className="mt-2"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsRejectDialogOpen(false);
                  setRejectionReason('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                className="flex-1"
                disabled={!rejectionReason.trim()}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

