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
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Logo />
            <p className="text-center text-sm text-muted-foreground md:text-left">
              © {year} Stock Sense. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
                <Link href="/support" className="text-sm text-muted-foreground hover:text-primary">Terms</Link>
                <Link href="/support" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link>
                <Link href="/support" className="text-sm text-muted-foreground hover:text-primary">Support</Link>
            </div>
            <p className="text-sm text-muted-foreground">
                v0.1.0-ui
            </p>
        </div>
      </div>
    </footer>
  );
}
