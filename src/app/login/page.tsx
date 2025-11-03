'use client';

import { useAuth, useUser } from '@/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome } from 'lucide-react';


export default function LoginPage() {
  const { user, signedIn } = useUser();
  const auth = useAuth();
  const router = useRouter();

  if (signedIn) {
    router.replace('/');
  }

  async function signInWithGoogle() {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.replace('/');
    } catch (error) {
      console.error('Error signing in with Google', error);
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
          <Button className="w-full" onClick={signInWithGoogle}>
            <Chrome className="mr-2 h-4 w-4" />
            Đăng nhập với Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
