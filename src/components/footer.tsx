"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from './logo';

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Logo />
            <p className="text-center text-sm text-gray-500 md:order-first">
              © {year} Stock Sense. All rights reserved.
            </p>
            <div className="flex items-center gap-x-4">
                <Link href="/terms" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">Terms</Link>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">Privacy</Link>
                <Link href="/support" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">Support</Link>
                <Link href="/#contact" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">Contact</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
