import React from "react";
import { cn } from "@/lib/utils"; // optional classNames helper
import { LeadStatus } from "@/types/company";

// type LeadStatus = "Visited" | "Dropped Off" | "" | null | undefined;

interface LeadStatusBadgeProps {
  status: LeadStatus;
}

const statusStyles: Record<string, string> = {
  Visited: "border-pink-500 text-pink-500 w-fit bg-transparent",
  "Dropped Off": "border-green-500 text-green-500 w-fit bg-transparent",
  "Not Started": "border-blue-500 text-blue-500 w-fit bg-transparent",
};

export const LeadStatusBadge: React.FC<LeadStatusBadgeProps> = ({ status }) => {
  const displayText =
    status === "Visited" || status === "Dropped Off" ? status : "Not Started";

  const styleClass = statusStyles[displayText] || statusStyles["Not Started"];

  return (
    <span
      className={cn(
        "px-3 py-1 text-xs font-semibold border rounded-full",
        styleClass
      )}
    >
      {displayText}
    </span>
  );
};
