'use client';
import Link from 'next/link';
import { Lightbulb, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useUser } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Header() {
  const { user, signedIn, signOut } = useUser();

  const handleSignOut = async () => {
    signOut();
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Lightbulb className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold font-headline text-foreground tracking-tighter">IdeaFlow</span>
        </Link>
        <div className="flex items-center gap-4">
          {signedIn && (
            <Button asChild>
                <Link href="/ideas/new">+ Ý tưởng mới</Link>
            </Button>
          )}

          {signedIn === true && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <Avatar>
                    <AvatarImage src={user.photoURL!} alt={user.displayName!} />
                    <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {signedIn === false && (
            <Button asChild variant="outline">
              <Link href="/login">Đăng nhập</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
