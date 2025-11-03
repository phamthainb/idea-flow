'use client';

import { useUser } from '@/lib/auth';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Chrome } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { signIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);

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
      onOpenChange(false);
    } catch (error) {
      console.error('Error signing in', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-headline text-center">
            Chào mừng đến với IdeaFlow
          </DialogTitle>
          <DialogDescription className="text-center">
            Đăng nhập để bắt đầu quản lý ý tưởng của bạn
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
            <Chrome className="mr-2 h-4 w-4" />
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập Demo'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}