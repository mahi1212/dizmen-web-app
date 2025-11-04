'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/types';
import { QrCode, Clock, Star, Edit3, Smartphone, TrendingUp } from 'lucide-react';
import Navbar from '@/components/dashboard/navbar';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('restaurant_authority');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password, role);
    
    if (role === 'restaurant_authority') {
      router.push('/dashboard');
    } else if (role === 'super_admin') {
      router.push('/admin');
    }
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to manage your restaurant</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@restaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Login As</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant_authority">Restaurant Owner</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setShowLogin(false)}
              >
                Back to Home
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
          <Navbar />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Digital Menus That <span className="text-orange-600">Adapt</span> in Real-Time
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Stop disappointing customers with unavailable items. Update your menu instantly, schedule time-based availability, and let customers see what's actually available right now.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" onClick={() => router.push('/auth')}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push('/menu/rest-1')}>
              View Demo Menu
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">The Problem We Solve</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-900">Without Dizmen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-red-800">
                <p>❌ Customers order unavailable items</p>
                <p>❌ Waiters constantly apologize</p>
                <p>❌ Paper menus get outdated quickly</p>
                <p>❌ No way to show breakfast/lunch/dinner hours</p>
                <p>❌ Customer frustration and lost sales</p>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-900">With Dizmen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-green-800">
                <p>✅ Show only available items in real-time</p>
                <p>✅ Update menu instantly from anywhere</p>
                <p>✅ Auto-schedule items for specific hours</p>
                <p>✅ Beautiful photos increase orders</p>
                <p>✅ Item-specific reviews build trust</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Clock className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Time-Based Scheduling</CardTitle>
                <CardDescription>
                  Set specific hours for breakfast, lunch, and dinner items. Items automatically show/hide based on time.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Edit3 className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Instant Updates</CardTitle>
                <CardDescription>
                  Hide items with one click when ingredients run out. Customers see changes immediately.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <QrCode className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>QR Code Access</CardTitle>
                <CardDescription>
                  Customers scan your QR code to see the menu. No app downloads required.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Star className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Item Reviews</CardTitle>
                <CardDescription>
                  Get specific feedback on each dish. Build trust with authentic customer reviews.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Smartphone className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Mobile Optimized</CardTitle>
                <CardDescription>
                  Beautiful, fast interface that works perfectly on any smartphone.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Increase Orders</CardTitle>
                <CardDescription>
                  High-quality photos and detailed descriptions help customers order confidently.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Modernize Your Menu?</h2>
          <p className="text-xl mb-8 text-orange-100">
            Join hundreds of restaurants providing better customer experiences
          </p>
          <Button size="lg" variant="secondary" onClick={() => router.push('/auth')}>
            Get Started Now
          </Button>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <QrCode className="h-6 w-6" />
            <span className="text-xl font-bold">Dizmen</span>
          </div>
          <p className="text-gray-400">Digital Menu Platform for Modern Restaurants</p>
        </div>
      </footer>
    </div>
  );
}
