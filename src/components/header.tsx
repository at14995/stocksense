"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { UserNav } from "@/components/user-nav";
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";
import NotificationBell from "@/features/notifications/NotificationBell";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/sentiment", label: "Sentiment" },
  { href: "/watchlists", label: "Watchlists" },
  { href: "/alerts", label: "Alerts" },
  { href: "/support", label: "Support" },
  { href: "/notifications", label: "Notifications"},
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 shrink-0 md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                    <nav className="flex flex-col gap-6 pt-8">
                        <Logo className="mb-4" />
                        {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={cn(
                            "text-lg font-medium",
                            pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
             <div className="ml-4">
              <Logo />
            </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
           <Logo />
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary underline" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell />
          <ThemeSwitcher />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
