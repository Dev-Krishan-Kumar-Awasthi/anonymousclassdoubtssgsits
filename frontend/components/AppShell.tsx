'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FB] text-[#172033] selection:bg-[#EAF3FB] selection:text-[#1769AA]">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
