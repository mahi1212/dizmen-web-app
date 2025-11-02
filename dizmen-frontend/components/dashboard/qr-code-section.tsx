'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QRCode from 'react-qr-code';
import { Download, ExternalLink } from 'lucide-react';
import { mockRestaurants } from '@/lib/mock-data';

export default function QRCodeSection() {
  const restaurant = mockRestaurants[0];
  const menuUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/menu/${restaurant.qrCode}`;

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `${restaurant.name}-QR-Code.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Your Menu QR Code</CardTitle>
          <CardDescription>
            Customers can scan this QR code to view your menu
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border" id="qr-code-wrapper">
            <QRCode
              id="qr-code"
              value={menuUrl}
              size={256}
              level="H"
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={downloadQRCode}>
              <Download className="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
            <Button variant="outline" onClick={() => window.open(menuUrl, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Menu
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
          <CardDescription>Display your QR code for customers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold">Download the QR Code</h4>
                <p className="text-sm text-gray-600">
                  Click the download button to save the QR code image
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold">Print and Display</h4>
                <p className="text-sm text-gray-600">
                  Print it on table tents, posters, or anywhere visible to customers
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold">Customers Scan & Order</h4>
                <p className="text-sm text-gray-600">
                  They'll see your live menu with only available items
                </p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-900">
              <strong>💡 Pro Tip:</strong> Place QR codes on every table for easy access. Update your menu anytime and customers will see changes instantly!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

