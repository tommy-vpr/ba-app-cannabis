// context/CreateContactModalContext.tsx
"use client";

import { HubSpotContact } from "@/types/contact";
import { createContext, useContext, useState } from "react";

// types
type ContactModalContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
  companyId?: string;
  setCompanyId: (id: string) => void;
  onContactCreated?: (contact: HubSpotContact) => void;
  setOnContactCreated: (cb?: (contact: HubSpotContact) => void) => void;
  onContactUpdated?: (contact: HubSpotContact) => void;
  setOnContactUpdated: (cb?: (contact: HubSpotContact) => void) => void;
};

const ContactModalContext = createContext<ContactModalContextType | undefined>(
  undefined
);

export const ContactModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [onContactCreated, setOnContactCreated] = useState<
    ((contact: HubSpotContact) => void) | undefined
  >(undefined);
  const [onContactUpdated, setOnContactUpdated] = useState<
    ((contact: HubSpotContact) => void) | undefined
  >(undefined);

  return (
    <ContactModalContext.Provider
      value={{
        open,
        setOpen,
        companyId: companyId ?? undefined,
        setCompanyId,
        onContactCreated,
        setOnContactCreated,
        onContactUpdated,
        setOnContactUpdated,
      }}
    >
      {children}
    </ContactModalContext.Provider>
  );
};

export const useContactModal = () => {
  const context = useContext(ContactModalContext);
  if (!context)
    throw new Error(
      "useCreateContactModal must be used within CreateContactModalProvider"
    );
  return context;
};
