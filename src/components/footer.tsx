"use client";
import React, { useState, useEffect } from 'react';
import { Logo } from './logo';

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
        <Logo />
        <p className="text-center text-sm text-muted-foreground md:text-left">
          © {year} Stock Sense. All rights reserved.
        </p>
        <p className="text-sm text-muted-foreground">
          Version 0.1.0
        </p>
      </div>
    </footer>
  );
}
