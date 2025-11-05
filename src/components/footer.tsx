"use client";
import React, { useState, useEffect } from 'react';
import { Logo } from './logo';
import Link from 'next/link';

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Logo />
            <p className="text-center text-sm text-muted-foreground md:order-first">
              © {year} Stock Sense. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms</Link>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link>
                <Link href="/support" className="text-sm text-muted-foreground hover:text-primary">Support</Link>
                <Link href="/#contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
