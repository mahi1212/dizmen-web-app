'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockRestaurants } from '@/lib/mock-data';
import { Restaurant } from '@/lib/types';
import { MapPin, Phone, Edit } from 'lucide-react';

export default function RestaurantInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant>(mockRestaurants[0]);
  const [formData, setFormData] = useState({
    name: restaurant.name,
    description: restaurant.description,
    address: restaurant.address,
    phone: restaurant.phone,
  });

  const handleSave = () => {
    setRestaurant({
      ...restaurant,
      ...formData,
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Restaurant Information</CardTitle>
            <CardDescription>Manage your restaurant details</CardDescription>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Restaurant Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{restaurant.name}</h3>
              <p className="text-gray-600 mt-2">{restaurant.description}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-start space-x-2 text-gray-700">
                <MapPin className="h-5 w-5 mt-0.5 text-orange-600" />
                <span>{restaurant.address}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Phone className="h-5 w-5 text-orange-600" />
                <span>{restaurant.phone}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

