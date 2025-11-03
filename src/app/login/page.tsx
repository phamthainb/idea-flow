'use client';

import { useUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome } from 'lucide-react';
import { useState } from 'react';


export default function LoginPage() {
  const { user, signedIn, signIn } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (signedIn) {
    router.replace('/');
  }

  async function handleLogin() {
    setIsLoading(true);
    try {
      // Simple demo login - in a real app, you'd integrate with a real auth service
      const demoUser = {
        id: 'demo-user',
        displayName: 'Demo User',
        photoURL: 'https://via.placeholder.com/40'
      };
      signIn(demoUser);
      router.replace('/');
    } catch (error) {
      console.error('Error signing in', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-headline">Chào mừng đến với IdeaFlow</CardTitle>
          <CardDescription>Đăng nhập để bắt đầu quản lý ý tưởng của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
            <Chrome className="mr-2 h-4 w-4" />
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập Demo'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
