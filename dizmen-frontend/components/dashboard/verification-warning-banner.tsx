'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { Restaurant } from '@/lib/types';

interface VerificationWarningBannerProps {
  restaurant: Restaurant;
}

export default function VerificationWarningBanner({ restaurant }: VerificationWarningBannerProps) {
  // Only show banner if restaurant is blocked
  if (restaurant.verificationStatus !== 'blocked') {
    return null;
  }

  return (
    <Alert variant="destructive" className="border-2 border-red-500 bg-red-50">
      <ShieldAlert className="h-5 w-5" />
      <AlertTitle className="text-lg font-bold">⚠️ Restaurant Blocked</AlertTitle>
      <AlertDescription className="text-sm mt-2">
        <p className="font-semibold">
          This restaurant has been blocked by administrators.
        </p>
        {restaurant.rejectionReason && (
          <p className="mt-2 font-semibold text-red-700">
            Reason: {restaurant.rejectionReason}
          </p>
        )}
        <p className="mt-2">
          The QR code and menu are temporarily unavailable. Please contact support for more information.
        </p>
      </AlertDescription>
    </Alert>
  );
}

