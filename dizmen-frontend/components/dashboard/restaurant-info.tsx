'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth-context';
import { mockRestaurants } from '@/lib/mock-data';
import { Restaurant, SocialMediaLink } from '@/lib/types';
import { MapPin, Phone, Edit, Eye, Globe, Link as LinkIcon, Plus, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function RestaurantInfo() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    website: '',
    googleLocationUrl: '',
    socialMediaLinks: [] as SocialMediaLink[],
  });

  useEffect(() => {
    // Load restaurant data for the current user
    if (user?.restaurantId) {
      // Try to find in mock data first
      let rest = mockRestaurants.find(r => r.id === user.restaurantId);
      
      // If not in mock data, try localStorage (for newly created restaurants)
      if (!rest) {
        const savedRestaurant = localStorage.getItem(`restaurant-${user.restaurantId}`);
        if (savedRestaurant) {
          rest = JSON.parse(savedRestaurant);
        }
      }
      
      if (rest) {
        setRestaurant(rest);
        setFormData({
          name: rest.name,
          description: rest.description || '',
          address: rest.address,
          phone: rest.phone || '',
          website: rest.website || '',
          googleLocationUrl: rest.googleLocationUrl || '',
          socialMediaLinks: rest.socialMediaLinks || [],
        });
        if (rest.profileImage) {
          setProfileImagePreview(rest.profileImage);
        }
      } else {
        // If still not found, create placeholder
        const tempRestaurant: Restaurant = {
          id: user.restaurantId,
          name: 'Your Restaurant',
          description: 'Add your restaurant description',
          address: 'Add your address',
          phone: '',
          website: '',
          googleLocationUrl: '',
          socialMediaLinks: [],
          ownerId: user.id,
          createdAt: new Date(),
          qrCode: user.restaurantId,
          verificationStatus: 'verified',
          onboardingStep: 'complete',
        };
        setRestaurant(tempRestaurant);
        setFormData({
          name: tempRestaurant.name,
          description: tempRestaurant.description || '',
          address: tempRestaurant.address,
          phone: tempRestaurant.phone || '',
          website: tempRestaurant.website || '',
          googleLocationUrl: tempRestaurant.googleLocationUrl || '',
          socialMediaLinks: tempRestaurant.socialMediaLinks || [],
        });
      }
    }
  }, [user]);

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast.success('Profile image uploaded');
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    toast.success('Profile image removed');
  };

  const addSocialLink = () => {
    setFormData({
      ...formData,
      socialMediaLinks: [...formData.socialMediaLinks, { platform: '', url: '' }],
    });
  };

  const removeSocialLink = (index: number) => {
    setFormData({
      ...formData,
      socialMediaLinks: formData.socialMediaLinks.filter((_, i) => i !== index),
    });
  };

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    const updated = [...formData.socialMediaLinks];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({
      ...formData,
      socialMediaLinks: updated,
    });
  };

  const handleSave = () => {
    if (restaurant) {
      const updatedRestaurant = {
        ...restaurant,
        ...formData,
        profileImage: profileImagePreview || undefined,
      };
      setRestaurant(updatedRestaurant);
      
      // Save to localStorage for persistence
      localStorage.setItem(`restaurant-${updatedRestaurant.id}`, JSON.stringify(updatedRestaurant));
      
      setIsEditing(false);
      toast.success('Restaurant information updated!');
      // In real app, save to backend here
    }
  };

  const handleCancel = () => {
    if (restaurant) {
      setFormData({
        name: restaurant.name,
        description: restaurant.description || '',
        address: restaurant.address,
        phone: restaurant.phone || '',
        website: restaurant.website || '',
        googleLocationUrl: restaurant.googleLocationUrl || '',
        socialMediaLinks: restaurant.socialMediaLinks || [],
      });
      setProfileImagePreview(restaurant.profileImage || null);
    }
    setIsEditing(false);
  };

  if (!restaurant) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">Loading restaurant information...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="edit" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="edit">
          <Edit className="h-4 w-4 mr-2" />
          Edit Info
        </TabsTrigger>
        <TabsTrigger value="preview">
          <Eye className="h-4 w-4 mr-2" />
          Customer View
        </TabsTrigger>
      </TabsList>

      {/* Edit Tab */}
      <TabsContent value="edit">
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
              <div className="space-y-6">
                {/* Profile Image */}
                <div className="space-y-3">
                  <Label>Restaurant Profile Image</Label>
                  <div className="flex flex-col items-center gap-4">
                    {profileImagePreview ? (
                      <div className="relative">
                        <img
                          src={profileImagePreview}
                          alt="Profile preview"
                          className="w-48 h-48 object-cover rounded-lg border-2 border-gray-300"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={removeProfileImage}
                          className="absolute -top-2 -right-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
                        <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <Label htmlFor="profileImage" className="cursor-pointer">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Click to upload profile image
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG up to 5MB
                          </p>
                        </Label>
                        <Input
                          id="profileImage"
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          onChange={handleProfileImageUpload}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-2">
                  <Label htmlFor="name">Restaurant Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., La Bella Vista"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., Authentic Italian cuisine in the heart of the city"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">This will be shown to customers on your menu page</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g., 456 Oak Avenue, Downtown"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g., +1 (234) 567-8900"
                  />
                </div>

                {/* Links */}
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://www.yourrestaurant.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="googleLocationUrl">Google Maps Location</Label>
                  <Input
                    id="googleLocationUrl"
                    type="url"
                    value={formData.googleLocationUrl}
                    onChange={(e) => setFormData({ ...formData, googleLocationUrl: e.target.value })}
                    placeholder="https://maps.google.com/?q=Your+Restaurant"
                  />
                  <p className="text-xs text-gray-500">Paste your Google Maps link</p>
                </div>

                {/* Social Media Links */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Social Media Links</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSocialLink}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Link
                    </Button>
                  </div>
                  
                  {formData.socialMediaLinks.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          value={link.platform}
                          onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                          placeholder="Platform (e.g., Facebook, Instagram)"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          value={link.url}
                          onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                          placeholder="URL (e.g., https://facebook.com/...)"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSocialLink(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {formData.socialMediaLinks.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No social media links added yet. Click "Add Link" to add one.
                    </p>
                  )}
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleSave} className="flex-1">Save Changes</Button>
                  <Button variant="outline" onClick={handleCancel} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Profile Image Display */}
                {profileImagePreview && (
                  <div className="flex justify-center">
                    <img
                      src={profileImagePreview}
                      alt={restaurant.name}
                      className="w-48 h-48 object-cover rounded-lg border-2 border-gray-300"
                    />
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{restaurant.name}</h3>
                  {restaurant.description && (
                    <p className="text-gray-600 mt-2">{restaurant.description}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-2 text-gray-700">
                    <MapPin className="h-5 w-5 mt-0.5 text-orange-600 flex-shrink-0" />
                    <span>{restaurant.address}</span>
                  </div>
                  {restaurant.phone && (
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Phone className="h-5 w-5 text-orange-600 flex-shrink-0" />
                      <span>{restaurant.phone}</span>
                    </div>
                  )}
                  {restaurant.website && (
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Globe className="h-5 w-5 text-orange-600 flex-shrink-0" />
                      <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                        {restaurant.website}
                      </a>
                    </div>
                  )}
                  {restaurant.googleLocationUrl && (
                    <div className="flex items-center space-x-2 text-gray-700">
                      <MapPin className="h-5 w-5 text-orange-600 flex-shrink-0" />
                      <a href={restaurant.googleLocationUrl} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                        View on Google Maps
                      </a>
                    </div>
                  )}
                </div>

                {/* Social Media Links */}
                {restaurant.socialMediaLinks && restaurant.socialMediaLinks.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Social Media</Label>
                    <div className="space-y-2">
                      {restaurant.socialMediaLinks.map((link, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-gray-700">
                          <LinkIcon className="h-4 w-4 text-orange-600 flex-shrink-0" />
                          <span className="font-medium">{link.platform}:</span>
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline truncate">
                            {link.url}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Customer View Preview Tab */}
      <TabsContent value="preview">
        <Card>
          <CardHeader>
            <CardTitle>Customer View</CardTitle>
            <CardDescription>This is how customers will see your restaurant information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Profile Image */}
              {profileImagePreview && (
                <div className="flex justify-center">
                  <img
                    src={profileImagePreview}
                    alt={restaurant.name}
                    className="w-full max-w-md h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* Restaurant Info */}
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
                {restaurant.description && (
                  <p className="text-gray-600 mt-3 text-lg">{restaurant.description}</p>
                )}
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-700">{restaurant.address}</p>
                  </div>
                </div>

                {restaurant.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-6 w-6 text-orange-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Phone</p>
                      <p className="text-gray-700">{restaurant.phone}</p>
                    </div>
                  </div>
                )}

                {restaurant.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-6 w-6 text-orange-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Website</p>
                      <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}

                {restaurant.googleLocationUrl && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-6 w-6 text-orange-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Location</p>
                      <a href={restaurant.googleLocationUrl} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                        View on Google Maps
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Media */}
              {restaurant.socialMediaLinks && restaurant.socialMediaLinks.length > 0 && (
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-3">Follow Us</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {restaurant.socialMediaLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        {link.platform}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

