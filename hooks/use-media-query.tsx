// hooks/use-media-query.ts
"use client";

import { useState, useEffect, useCallback } from 'react';

// Helper to convert Tailwind breakpoint key to approximate pixel value
// In a real application, you might want a more robust way to sync this with your tailwind.config.js
// or use a library that handles this.
const getBreakpointValue = (breakpointKey: "sm" | "md" | "lg" | "xl" | "2xl"): number => {
  switch (breakpointKey) {
    case 'sm': return 640;
    case 'md': return 768;
    case 'lg': return 1024;
    case 'xl': return 1280;
    case '2xl': return 1536;
    default: return 768; // Default to md if somehow an invalid key is passed
  }
};

export function useMediaQuery(breakpointKey: "sm" | "md" | "lg" | "xl" | "2xl"): boolean {
  // Initialize to a state that doesn't cause hydration mismatch if possible.
  // Returning `false` (i.e., "not mobile") during SSR/initial client render is a common strategy.
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const updateMatch = useCallback(() => {
    if (typeof window !== 'undefined') {
      const breakpointPx = getBreakpointValue(breakpointKey);
      // True if window width is LESS than the breakpoint value (e.g., for 'md' (768px), true if < 768)
      setIsMobile(window.innerWidth < breakpointPx);
    }
  }, [breakpointKey]);

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window !== 'undefined') {
      updateMatch(); // Set initial state correctly on the client
      window.addEventListener('resize', updateMatch);
      return () => {
        window.removeEventListener('resize', updateMatch);
      };
    }
  }, [updateMatch]);

  return isMobile;
}