import { Skeleton } from "../ui/skeleton";

export const SkeletonCard = () => {
  return (
    <div className="border rounded-lg p-4 flex flex-col gap-3 dark:bg-[#212830]">
      <Skeleton className="h-6 w-2/3 dark:bg-[#161b22]" />
      <Skeleton className="h-4 w-full dark:bg-[#161b22]" />
      <Skeleton className="h-4 w-full dark:bg-[#161b22]" />
      <Skeleton className="h-4 w-3/4 dark:bg-[#161b22]" />
      <Skeleton className="h-5 w-24 mt-auto dark:bg-[#161b22]" />
    </div>
  );
};
