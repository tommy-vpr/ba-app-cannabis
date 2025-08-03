import { Skeleton } from "@/app/components/ui/skeleton";

export const SkeletonCompanyList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4 shadow space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
};
