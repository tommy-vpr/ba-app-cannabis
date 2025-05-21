// context/DemoDayModalContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { HubSpotContact } from "@/types/hubspot";

interface DemoDayModalContextType {
  demoOpen: boolean;
  setDemoOpen: (open: boolean) => void;
  demoContactData: HubSpotContact | null;
  setDemoContactData: (contact: HubSpotContact | null) => void;
}

const DemoDayModalContext = createContext<DemoDayModalContextType | undefined>(
  undefined
);

export function DemoDayModalProvider({ children }: { children: ReactNode }) {
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoContactData, setDemoContactData] = useState<HubSpotContact | null>(
    null
  );

  return (
    <DemoDayModalContext.Provider
      value={{ demoOpen, setDemoOpen, demoContactData, setDemoContactData }}
    >
      {children}
    </DemoDayModalContext.Provider>
  );
}

export function useDemoDayModal() {
  const context = useContext(DemoDayModalContext);
  if (!context)
    throw new Error(
      "useDemoDayModal must be used within a DemoDayModalProvider"
    );
  return context;
}
