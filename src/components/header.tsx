"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
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
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navLinks = user ? loggedInLinks : loggedOutLinks;

  const menuVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0, transition: { staggerChildren: 0.05, duration: 0.3, ease: 'easeOut' } },
  };

  const menuItemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 },
  };


  return (
    <header>
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-8 lg:px-12">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
           <Logo />
           <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative font-medium text-gray-300 transition-colors hover:text-indigo-400",
                  pathname === link.href && "text-white"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-indigo-500"
                    layoutId="underline"
                  />
                )}
              </Link>
            ))}
           </nav>
        </div>

        {/* Mobile Logo */}
        <div className="md:hidden">
            <Logo />
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          <CurrencySelector />
          {user && <NotificationBell />}
          <UserNav />
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
      {isMenuOpen && (
        <motion.div
            className="absolute top-16 left-0 w-full bg-[#0B0D14]/90 backdrop-blur-xl border-b border-white/10 md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
        >
            <nav className="flex flex-col gap-2 p-4">
                {navLinks.map((link) => (
                <motion.div key={link.href} variants={menuItemVariants}>
                    <Link
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                        "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
                        pathname === link.href ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-white/10"
                        )}
                    >
                        {link.label}
                    </Link>
                </motion.div>
                ))}
            </nav>
        </motion.div>
      )}
      </AnimatePresence>
    </header>
  );
}
