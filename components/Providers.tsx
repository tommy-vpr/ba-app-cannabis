// components/Providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { BrandProvider } from "@/context/BrandContext";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";
import { DemoDayModalProvider } from "@/context/DemoDayContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <SessionProvider>
      <BrandProvider>
        <DemoDayModalProvider>
          <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </NextThemesProvider>
        </DemoDayModalProvider>
      </BrandProvider>
    </SessionProvider>
  );
}
