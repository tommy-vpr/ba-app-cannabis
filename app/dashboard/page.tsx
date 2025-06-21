// app/dashboard/page.tsx
import CompactSearchAndFilter from "@/components/CompactSearchAndFilter";
import { ContactCardList } from "@/components/ContactCardList";
import { EditContactModal } from "@/components/EditContactModal";
import FilteringSystem from "@/components/FilteringSystem";
import { PaginationControls } from "@/components/PaginationControls";

export default function DashboardPage() {
  return (
    <div className="p-4 w-full max-w-[1200px] mx-auto">
      {/* <CompactSearchAndFilter /> */}
      {/* <FilteringSystem /> */}
      <div className="mt-4">
        <ContactCardList />
        {/* <EditContactModal /> */}
        <PaginationControls />
      </div>
    </div>
  );
}
