"use client";

import { TodoContactCardList } from "@/components/ToDoContactCardList";
import { PaginationControlsNotSent } from "@/components/PaginationControlsNotSent";
import FilteringSystem from "@/components/FilteringSystem";
import { useContactContext } from "@/context/ContactContext";
import { useMemo } from "react";

export default function NotSentPage() {
  const { contacts } = useContactContext();

  const notStartedCount = useMemo(() => {
    return contacts.filter(
      (c) => c.properties.hs_lead_status !== "Sent Samples"
    ).length;
  }, [contacts]);

  return (
    <div className="p-4 w-full max-w-[1200px] mx-auto py-8 md:py-12">
      <h1 className="text-gray-500 dark:text-gray-200 text-2xl font-semibold mb-4">
        Awaiting Actions
        <span className="ml-2 text-green-500 font-normal">
          ({notStartedCount})
        </span>
      </h1>
      <div className="hidden">
        <FilteringSystem />
      </div>
      <div className="mt-4">
        <TodoContactCardList />
        <PaginationControlsNotSent />
      </div>
    </div>
  );
}
