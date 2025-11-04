'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Building, 
  MapPin, 
  Phone, 
  CheckCircle, 
  Info,
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
  Link as LinkIcon,
  Save,
  Clock,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { mockUsers } from '@/lib/mock-data';
import { toast } from 'sonner';

// Validation schema
const restaurantSchema = z.object({
  name: z.string().min(2, 'Restaurant name must be at least 2 characters'),
  description: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  phone: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  googleLocationUrl: z.string().url('Invalid Google Maps URL').optional().or(z.literal('')),
  socialMediaLinks: z.array(z.object({
    platform: z.string().min(1, 'Platform name is required'),
    url: z.string().url('Invalid URL'),
  })).optional(),
});

type RestaurantFormData = z.infer<typeof restaurantSchema>;

export default function RestaurantOnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      phone: '',
      website: '',
      googleLocationUrl: '',
      socialMediaLinks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'socialMediaLinks',
  });

  // Load draft data on mount
  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    // Check if user has a restaurant already
    if (user.restaurantId) {
      router.push('/dashboard');
      return;
    }

    // Try to load draft if exists
    const currentUser = mockUsers.find(u => u.id === user.id);
    if (currentUser?.onboardingDraft) {
      const draft = currentUser.onboardingDraft;
      
      // Restore step
      setStep(draft.step);
      
      // Restore form data
      if (draft.formData) {
        form.reset(draft.formData as RestaurantFormData);
      }
      
      // Restore last saved time
      setLastSaved(draft.lastSaved);
      
      toast.success('Draft restored! Continue where you left off.');
    } else {
      // New user - no draft
      console.log('New user - starting fresh onboarding');
    }
  }, [user, router, form]);

  const totalSteps = 2;
  const progress = (step / totalSteps) * 100;

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    
    const formData = form.getValues();
    const draft = {
      step,
      formData,
      profileImage: profileImage ? {
        name: profileImage.name,
        size: profileImage.size,
        type: profileImage.type,
      } : null,
      lastSaved: new Date(),
    };

    // Simulate API call to save draft
    setTimeout(() => {
      console.log('Draft saved:', draft);
      setLastSaved(new Date());
      setIsSavingDraft(false);
      toast.success('Draft saved successfully!');
    }, 1000);
  };

  const handleRestaurantInfoNext = async () => {
    const isValid = await form.trigger(['name', 'address']);
    if (!isValid) {
      toast.error('Please fix the errors before continuing');
      return;
    }
    
    // Auto-save draft before moving to next step
    await handleSaveDraft();
    setStep(2);
  };

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

  const handleSubmit = async () => {
    const formData = form.getValues();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Restaurant Data:', formData);
      console.log('Profile Image:', profileImage);
      
      // Create new restaurant ID
      const newRestaurantId = `rest-${Date.now()}`;
      
      // Create restaurant object
      const newRestaurant = {
        id: newRestaurantId,
        name: formData.name,
        description: formData.description || '',
        address: formData.address,
        phone: formData.phone || '',
        website: formData.website || '',
        googleLocationUrl: formData.googleLocationUrl || '',
        socialMediaLinks: formData.socialMediaLinks || [],
        profileImage: profileImagePreview || undefined,
        ownerId: user!.id,
        createdAt: new Date(),
        qrCode: newRestaurantId,
        verificationStatus: 'verified' as const,
        onboardingStep: 'complete' as const,
      };
      
      // Save restaurant to localStorage
      localStorage.setItem(`restaurant-${newRestaurantId}`, JSON.stringify(newRestaurant));
      
      // Update user with restaurant ID (restaurant is immediately active, not pending)
      const updatedUser = {
        ...user!,
        restaurantId: newRestaurantId,
        onboardingCompleted: true,
        onboardingDraft: undefined, // Clear draft after submission
      };
      
      // Save user to localStorage (in real app, this would be API call)
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Clear draft after successful submission
      toast.success('Restaurant created successfully!');
      toast.info('Your restaurant is now live! You can start managing your menu.');
      
      // Redirect to dashboard and force reload to update auth context
      window.location.href = '/dashboard';
      setIsSubmitting(false);
    }, 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add Your Restaurant</h1>
              <p className="text-gray-500 mt-1">Complete the following steps to get started</p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              
              {lastSaved && (
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last saved: {lastSaved.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Step {step} of {totalSteps}</span>
                <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between mt-6">
              <div className={`flex items-center ${step >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
                <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${step >= 1 ? 'border-orange-600 bg-orange-50' : 'border-gray-300'}`}>
                  {step > 1 ? <CheckCircle className="h-5 w-5" /> : '1'}
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:inline">Restaurant Info</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
              <div className={`flex items-center ${step >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
                <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${step >= 2 ? 'border-orange-600 bg-orange-50' : 'border-gray-300'}`}>
                  {step > 2 ? <CheckCircle className="h-5 w-5" /> : '2'}
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:inline">Profile & Links</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-orange-600" />
                Restaurant Information
              </CardTitle>
              <CardDescription>
                Tell us about your restaurant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Restaurant Name *</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="e.g., La Bella Vista"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description </Label>
                <Textarea
                  id="description"
                  {...form.register('description')}
                  placeholder="e.g., Authentic Italian cuisine in the heart of the city"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be shown to customers on your menu page
                </p>
              </div>

              <div>
                <Label htmlFor="address">Full Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="address"
                    {...form.register('address')}
                    placeholder="e.g., 456 Oak Avenue, Downtown"
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.address && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.address.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    {...form.register('phone')}
                    placeholder="e.g., +1 (234) 567-8900"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={handleSaveDraft} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button onClick={handleRestaurantInfoNext} className="flex-1">
                  Continue to Profile & Links
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Profile & Links */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-orange-600" />
                Profile & Links
              </CardTitle>
              <CardDescription>
                Add a profile image and your online presence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image Upload */}
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
                          PNG, JPG up to 5MB (recommended: 1:1 ratio)
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
                <p className="text-xs text-gray-500">
                  This image will be displayed on your menu page
                </p>
              </div>

              {/* Website */}
              <div>
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="website"
                    type="url"
                    {...form.register('website')}
                    placeholder="https://www.yourrestaurant.com"
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.website && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.website.message}</p>
                )}
              </div>

              {/* Google Maps Location */}
              <div>
                <Label htmlFor="googleLocationUrl">Google Maps Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="googleLocationUrl"
                    type="url"
                    {...form.register('googleLocationUrl')}
                    placeholder="https://maps.google.com/?q=Your+Restaurant"
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.googleLocationUrl && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.googleLocationUrl.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Paste your Google Maps link so customers can find you easily
                </p>
              </div>

              {/* Social Media Links */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Social Media Links</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ platform: '', url: '' })}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Link
                  </Button>
                </div>
                
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        {...form.register(`socialMediaLinks.${index}.platform`)}
                        placeholder="Platform (e.g., Facebook, Instagram)"
                      />
                      {form.formState.errors.socialMediaLinks?.[index]?.platform && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.socialMediaLinks[index]?.platform?.message}
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        {...form.register(`socialMediaLinks.${index}.url`)}
                        placeholder="URL (e.g., https://facebook.com/...)"
                      />
                      {form.formState.errors.socialMediaLinks?.[index]?.url && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.socialMediaLinks[index]?.url?.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {fields.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No social media links added yet. Click "Add Link" to add one.
                  </p>
                )}
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Ready to launch?</AlertTitle>
                <AlertDescription className="text-sm mt-2">
                  Once you submit, your restaurant will be immediately live and customers can scan your QR code to view your menu. You can start adding menu items from your dashboard.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Restaurant'}
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
