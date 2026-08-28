"use client";

// Generic top-level providers wrapper.
// Add QueryClientProvider, ThemeProvider (next-themes), etc. as needed.
// The Toaster comes from the vaidyuti `sonner` component and must be mounted once.

import { Toaster } from "@/components/vaidyuti/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
