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
  FileText, 
  Upload, 
  CheckCircle, 
  Info,
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
  Link as LinkIcon,
  Save,
  Clock
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
  const [documents, setDocuments] = useState<File[]>([]);
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

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    
    const formData = form.getValues();
    const draft = {
      step,
      formData,
      documents: documents.map(doc => ({
        name: doc.name,
        size: doc.size,
        type: doc.type,
      })),
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
    const isValid = await form.trigger(['name', 'address', 'website', 'googleLocationUrl', 'socialMediaLinks']);
    if (!isValid) {
      toast.error('Please fix the errors before continuing');
      return;
    }
    
    // Auto-save draft before moving to next step
    await handleSaveDraft();
    setStep(2);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setDocuments([...documents, ...newFiles]);
      toast.success(`${newFiles.length} document(s) uploaded`);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
    toast.success('Document removed');
  };

  const handleSubmit = async () => {
    if (documents.length === 0) {
      toast.error('Please upload at least one verification document');
      return;
    }

    const formData = form.getValues();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Restaurant Data:', formData);
      console.log('Documents:', documents);
      
      // Create new restaurant ID
      const newRestaurantId = `rest-${Date.now()}`;
      
      // Update user with onboarding completed flag and restaurant ID
      const updatedUser = {
        ...user!,
        restaurantId: newRestaurantId,
        onboardingCompleted: true,
        onboardingDraft: undefined, // Clear draft after submission
      };
      
      // Save to localStorage (in real app, this would be API call)
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Clear draft after successful submission
      toast.success('Restaurant submitted for verification!');
      toast.info('You can now access your dashboard. QR code will be available after admin verification.');
      
      // Redirect to dashboard and force reload to update auth context
      window.location.href = '/dashboard';
      setIsSubmitting(false);
    }, 2000);
  };

  const restaurantData = form.watch();

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
                <span className="ml-2 text-sm font-medium hidden sm:inline">Basic Info</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
              <div className={`flex items-center ${step >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
                <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${step >= 2 ? 'border-orange-600 bg-orange-50' : 'border-gray-300'}`}>
                  {step > 2 ? <CheckCircle className="h-5 w-5" /> : '2'}
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:inline">Documents</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
              <div className={`flex items-center ${step >= 3 ? 'text-orange-600' : 'text-gray-400'}`}>
                <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${step >= 3 ? 'border-orange-600 bg-orange-50' : 'border-gray-300'}`}>
                  {step > 3 ? <CheckCircle className="h-5 w-5" /> : '3'}
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:inline">Review</span>
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
                  placeholder="e.g., The Golden Spoon"
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
                  placeholder="Describe your restaurant, cuisine type, and unique offerings"
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
                    placeholder="123 Main Street, City, State, ZIP"
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
                    placeholder="+1 (234) 567-8900"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="googleLocationUrl">Google Maps Location </Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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

              <div>
                <Label htmlFor="website">Website </Label>
                <Input
                  id="website"
                  type="url"
                  {...form.register('website')}
                  placeholder="https://www.yourrestaurant.com"
                />
                {form.formState.errors.website && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.website.message}</p>
                )}
              </div>

              {/* Social Media Links */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Social Media Links </Label>
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

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={handleSaveDraft} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button onClick={handleRestaurantInfoNext} className="flex-1">
                  Continue to Documents
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Verification Documents */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                Verification Documents
              </CardTitle>
              <CardDescription>
                Upload required documents for verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Required Documents</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Business Registration or License</li>
                    <li>Food Service Permit / Health Certificate</li>
                    <li>Proof of Identity (Owner/Manager)</li>
                    <li>Tax ID / EIN Documentation</li>
                    <li>Additional permits (if applicable)</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <Label htmlFor="documents" className="cursor-pointer">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Click to upload documents
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, PNG, JPG up to 10MB each (multiple files allowed)
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
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            {(doc.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(idx)}
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
                  onClick={() => setStep(3)}
                  className="flex-1"
                  disabled={documents.length === 0}
                >
                  Review
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-orange-600" />
                  Review Your Information
                </CardTitle>
                <CardDescription>
                  Please review before submitting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Restaurant Details */}
                <div>
                  <h3 className="font-semibold mb-3">Restaurant Details</h3>
                  <div className="grid gap-3 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium">{restaurantData.name}</p>
                    </div>
                    {restaurantData.description && (
                      <div>
                        <p className="text-xs text-gray-500">Description</p>
                        <p className="text-sm">{restaurantData.description}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm">{restaurantData.address}</p>
                    </div>
                    {restaurantData.phone && (
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm">{restaurantData.phone}</p>
                      </div>
                    )}
                    {restaurantData.website && (
                      <div>
                        <p className="text-xs text-gray-500">Website</p>
                        <p className="text-sm break-all">{restaurantData.website}</p>
                      </div>
                    )}
                    {restaurantData.googleLocationUrl && (
                      <div>
                        <p className="text-xs text-gray-500">Google Maps Location</p>
                        <p className="text-sm break-all">{restaurantData.googleLocationUrl}</p>
                      </div>
                    )}
                    {restaurantData.socialMediaLinks && restaurantData.socialMediaLinks.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Social Media</p>
                        <div className="space-y-1">
                          {restaurantData.socialMediaLinks.map((link, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm">
                              <span className="font-medium">{link.platform}:</span>
                              <span className="text-gray-600 break-all">{link.url}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="font-semibold mb-3">Verification Documents</h3>
                  <div className="space-y-2">
                    {documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg border">
                        <FileText className="h-5 w-5 text-gray-500 mr-3" />
                        <span className="text-sm">{doc.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Important Notice */}
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>What happens next?</AlertTitle>
                  <AlertDescription className="text-sm mt-2">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Your application will be reviewed by our team</li>
                      <li>We'll verify your documents within 6-24 hours</li>
                      <li>You'll receive an email notification about the status</li>
                      <li>Once approved, you can start managing your menu</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
