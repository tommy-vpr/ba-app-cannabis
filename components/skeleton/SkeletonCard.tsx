import { Skeleton } from "../ui/skeleton";

export const SkeletonCard = () => {
  return (
    <div className="border rounded-lg p-4 flex flex-col gap-3 dark:bg-black/20 bg-gray-200">
      <Skeleton className="h-6 w-2/3 bg-gray-100 dark:bg-gray-200/10" />
      <Skeleton className="h-4 w-full bg-gray-100 dark:bg-gray-200/10" />
      <Skeleton className="h-4 w-full bg-gray-100 dark:bg-gray-200/10" />
      <Skeleton className="h-4 w-3/4 bg-gray-100 dark:bg-gray-200/10" />
      <Skeleton className="h-5 w-24 mt-auto bg-gray-100 dark:bg-gray-200/10" />
    </div>
  );
};
