'use client';

import { Button } from './ui/button';
import { QrCode } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => router.push('/')}
          >
            <QrCode className="h-8 w-8 text-orange-600" />
            <span className="text-2xl font-bold text-gray-900">Dizmen</span>
          </div>
          <div className="flex space-x-4">
            {pathname !== '/auth' && (
              <>
                <Button variant="ghost" onClick={() => router.push('/auth')}>
                  Sign In
                </Button>
                <Button onClick={() => router.push('/auth')}>
                  Get Started
                </Button>
              </>
            )}
            {pathname === '/auth' && (
              <Button variant="ghost" onClick={() => router.push('/')}>
                Back to Home
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
