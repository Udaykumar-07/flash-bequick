"use client";

import FlashLogo from '@/components/icons/logo';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full border-t border-border/50 bg-secondary/30">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-8 md:px-6">
        <FlashLogo />
        <p className="text-sm text-muted-foreground font-body">
          &copy; {currentYear} Flash Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}