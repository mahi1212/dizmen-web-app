'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle, Clock, XCircle, FileText, Shield, Building } from 'lucide-react';
import { Restaurant } from '@/lib/types';
import { toast } from 'sonner';

interface OnboardingFlowProps {
  restaurant: Restaurant;
  onComplete: (updatedRestaurant: Restaurant) => void;
}

export default function OnboardingFlow({ restaurant, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(restaurant.onboardingStep);
  const [restaurantData, setRestaurantData] = useState({
    name: restaurant.name || '',
    description: restaurant.description || '',
    address: restaurant.address || '',
    phone: restaurant.phone || '',
  });
  const [documents, setDocuments] = useState<File[]>([]);

  const getProgress = () => {
    if (currentStep === 'restaurant_info') return 33;
    if (currentStep === 'verification_documents') return 66;
    return 100;
  };

  const handleRestaurantInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!restaurantData.name || !restaurantData.address || !restaurantData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Restaurant information saved!');
    setCurrentStep('verification_documents');
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setDocuments([...documents, ...newFiles]);
      toast.success(`${newFiles.length} document(s) uploaded`);
    }
  };

  const handleSubmitForVerification = () => {
    if (documents.length === 0) {
      toast.error('Please upload at least one verification document');
      return;
    }

    const updatedRestaurant: Restaurant = {
      ...restaurant,
      ...restaurantData,
      onboardingStep: 'complete',
      verificationStatus: 'pending',
      verificationDocuments: documents.map((doc, idx) => ({
        id: `doc-${Date.now()}-${idx}`,
        documentType: 'business_license',
        documentUrl: URL.createObjectURL(doc),
        uploadedAt: new Date(),
      })),
    };

    toast.success('Submitted for verification! Our team will review your application.');
    onComplete(updatedRestaurant);
  };

  const getStatusBadge = () => {
    switch (restaurant.verificationStatus) {
      case 'verified':
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  if (restaurant.onboardingStep === 'complete' && restaurant.verificationStatus !== 'rejected') {
    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verification Status
              </CardTitle>
              <CardDescription className="mt-1">
                Your restaurant verification status
              </CardDescription>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent>
          {restaurant.verificationStatus === 'pending' && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Your restaurant is currently under review by our administrators. 
                This typically takes 6-24 hours We'll notify you once the review is complete.
              </AlertDescription>
            </Alert>
          )}
          {restaurant.verificationStatus === 'verified' && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">Verified!</AlertTitle>
              <AlertDescription className="text-green-800">
                Congratulations! Your restaurant has been verified. 
                {restaurant.verifiedAt && ` Verified on ${restaurant.verifiedAt.toLocaleDateString()}`}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Restaurant Onboarding
          </CardTitle>
          <CardDescription>
            Complete the following steps to verify your restaurant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-gray-500">{getProgress()}%</span>
              </div>
              <Progress value={getProgress()} className="h-2" />
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between py-4">
              <div className={`flex items-center ${currentStep === 'restaurant_info' ? 'text-orange-600' : 'text-gray-400'}`}>
                <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${currentStep === 'restaurant_info' ? 'border-orange-600 bg-orange-50' : 'border-gray-300'}`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:inline">Restaurant Info</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
              <div className={`flex items-center ${currentStep === 'verification_documents' ? 'text-orange-600' : 'text-gray-400'}`}>
                <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${currentStep === 'verification_documents' ? 'border-orange-600 bg-orange-50' : 'border-gray-300'}`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:inline">Documents</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
              <div className={`flex items-center ${currentStep === 'complete' ? 'text-orange-600' : 'text-gray-400'}`}>
                <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${currentStep === 'complete' ? 'border-orange-600 bg-orange-50' : 'border-gray-300'}`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:inline">Complete</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Restaurant Information Step */}
      {currentStep === 'restaurant_info' && (
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Information</CardTitle>
            <CardDescription>
              Provide basic information about your restaurant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRestaurantInfoSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Restaurant Name *</Label>
                <Input
                  id="name"
                  value={restaurantData.name}
                  onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })}
                  placeholder="Enter restaurant name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={restaurantData.description}
                  onChange={(e) => setRestaurantData({ ...restaurantData, description: e.target.value })}
                  placeholder="Describe your restaurant"
                  rows={3}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={restaurantData.address}
                  onChange={(e) => setRestaurantData({ ...restaurantData, address: e.target.value })}
                  placeholder="Enter full address"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={restaurantData.phone}
                  onChange={(e) => setRestaurantData({ ...restaurantData, phone: e.target.value })}
                  placeholder="+1234567890"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Continue to Documents
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Verification Documents Step */}
      {currentStep === 'verification_documents' && (
        <Card>
          <CardHeader>
            <CardTitle>Verification Documents</CardTitle>
            <CardDescription>
              Upload required documents for verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertTitle>Required Documents</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Business License</li>
                  <li>Health & Safety Permit</li>
                  <li>Proof of Identity (Owner/Manager)</li>
                  <li>Additional relevant permits (optional)</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <Label htmlFor="documents" className="cursor-pointer">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Click to upload documents
                </p>
                <p className="text-xs text-gray-500">
                  PDF, PNG, JPG up to 10MB each
                </p>
              </Label>
              <Input
                id="documents"
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleDocumentUpload}
                className="hidden"
              />
            </div>

            {documents.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Documents ({documents.length})</Label>
                {documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDocuments(documents.filter((_, i) => i !== idx))}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('restaurant_info')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmitForVerification}
                className="flex-1"
                disabled={documents.length === 0}
              >
                Submit for Verification
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

