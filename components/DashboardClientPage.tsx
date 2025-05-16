"use client";

import { useContactContext } from "@/context/ContactContext";
import { ContactCard } from "@/components/ContactCard";
import { ContactCardList } from "./ContactCardList";

export function DashboardClientPage() {
  return <ContactCardList />;
}
