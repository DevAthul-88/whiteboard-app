'use client';

import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';
import type { ThemeProviderProps } from 'next-themes';

export function ColorModeProvider(props: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      {...props}
    />
  );
}
