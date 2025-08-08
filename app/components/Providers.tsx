// components/Providers.tsx
"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

import { CannabisCompanyProvider } from "@/context/CompanyContext";
import CreateContactModal from "./CreateContactModal";
import { ContactModalProvider } from "@/context/ContactModalContext";

function InnerProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const userEmail = session?.user?.email ?? "";

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <CannabisCompanyProvider userEmail={userEmail}>
      <ContactModalProvider>
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <CreateContactModal />
        </NextThemesProvider>
      </ContactModalProvider>
    </CannabisCompanyProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <InnerProviders>{children}</InnerProviders>
    </SessionProvider>
  );
}
