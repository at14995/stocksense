"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserNav } from "@/components/user-nav";
import { cn } from "@/lib/utils";
import React from "react";
import NotificationBell from "@/features/notifications/NotificationBell";
import { useUser } from "@/firebase";
import { CurrencySelector } from "./CurrencySelector";

const loggedInLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/analyst", label: "Analyst" },
  { href: "/watchlists", label: "Watchlists" },
  { href: "/alerts", label: "Alerts" },
  { href: "/support", label: "Support" },
];

const loggedOutLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/support", label: "Support" },
];

export function Header() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navLinks = user ? loggedInLinks : loggedOutLinks;

  return (
    <header>
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-4 md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                    <nav className="flex flex-col gap-6 pt-8">
                        <div className="px-4">
                            <Logo />
                        </div>
                        {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={cn(
                            "text-lg font-medium px-4 py-2 rounded-md",
                            pathname === link.href ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
           <Logo />
           <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
                <Link
                key={link.href}
                href={link.href}
                className={cn(
                    "font-medium transition-colors hover:text-primary",
                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
                >
                {link.label}
                </Link>
            ))}
            </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <CurrencySelector />
          {user && <NotificationBell />}
          <UserNav />
        </div>
      </div>
    </header>
  );
}
