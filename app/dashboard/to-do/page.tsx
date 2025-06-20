import { TodoContactCardList } from "@/components/ToDoContactCardList";
import { PaginationControlsNotSent } from "@/components/PaginationControlsNotSent";
import FilteringSystem from "@/components/FilteringSystem";

export default function NotSentPage() {
  return (
    <div className="p-4 w-full max-w-[1200px] mx-auto py-8 md:py-12">
      <h1 className="text-gray-500 dark:text-gray-200 text-2xl font-semibold mb-4">
        Awaiting Actions
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
