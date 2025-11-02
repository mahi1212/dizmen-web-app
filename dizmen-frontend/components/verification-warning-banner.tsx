'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { Restaurant } from '@/lib/types';

interface VerificationWarningBannerProps {
  restaurant: Restaurant;
}

export default function VerificationWarningBanner({ restaurant }: VerificationWarningBannerProps) {
  if (restaurant.verificationStatus === 'verified') {
    return null;
  }

  return (
    <Alert variant="destructive" className="border-2 border-red-500 bg-red-50">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle className="text-lg font-bold">⚠️ Unverified Restaurant</AlertTitle>
      <AlertDescription className="text-sm mt-2">
        <p className="font-semibold">
          This restaurant has not been verified by our administrators yet.
        </p>
        <p className="mt-2">
          Please be cautious as the content may not have been reviewed for accuracy or safety. 
          We recommend verifying the information independently before making any decisions.
        </p>
        {restaurant.verificationStatus === 'rejected' && restaurant.rejectionReason && (
          <p className="mt-2 font-semibold text-red-700">
            Verification was rejected: {restaurant.rejectionReason}
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
}

