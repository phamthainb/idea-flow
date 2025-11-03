"use client";
import { useUser } from "@/lib/auth";
import { Lightbulb, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginModal } from "./login-modal";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Header() {
  const { user, signedIn, signOut } = useUser();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const pathname = usePathname();

  // check user and show login modal if not signed in
  useEffect(() => {
    if (!signedIn) {
      setLoginModalOpen(true);
    }
  }, [signedIn]);

  // watch query "login-modal" to open login modal automatically when url changes
  useEffect(() => {
    const url = new URL(window.location.href);
    const showLoginModal = url.searchParams.get("login-modal");
    if (showLoginModal === "true") {
      setLoginModalOpen(true);
    }
  }, [pathname]);

  const handleSignOut = async () => {
    signOut();
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Lightbulb className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold font-headline text-foreground tracking-tighter">
            IdeaFlow
          </span>
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
            <Button variant="outline" onClick={() => setLoginModalOpen(true)}>
              Đăng nhập
            </Button>
          )}
        </div>
      </div>
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </header>
  );
}
