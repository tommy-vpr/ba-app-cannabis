// components/skeletons/company-detail-skeleton.tsx

import { Skeleton } from "@/app/components/ui/skeleton";

export function ContactDetailSkeleton() {
  return (
    <div className="w-full max-w-[900px] mx-auto p-6 space-y-6">
      {/* Company Card Skeleton */}
      <div className="shadow-md shadow-gray-200 dark:shadow-black/30 flex flex-col md:flex-row rounded-md gap-8 p-6 border border-muted dark:border-[#30363d] bg-white dark:bg-[#161b22]">
        <div className="hidden h-36 w-36 rounded-full md:flex m-auto items-center justify-center">
          <Skeleton className="h-36 w-36 rounded-full" />
        </div>

        <div className="flex-1 space-y-4">
          <Skeleton className="h-6 w-2/3" /> {/* Business Name */}
          <Skeleton className="h-5 w-32 rounded-full" /> {/* Status */}
          {/* Phone */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-40" />
          </div>
          {/* Address */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>

      {/* Associated Contacts Title */}
      <Skeleton className="h-6 w-1/3" />

      {/* Contact Cards Skeleton */}
      <div className="flex flex-col gap-4">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="h-full flex flex-col md:flex-row shadow-md shadow-gray-200 dark:shadow-black/30 rounded-md gap-4 p-6 border border-muted dark:border-[#30363d] bg-white dark:bg-[#161b22]"
          >
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-4">
                <div className="flex justify-center"></div>
                <div className="flex flex-col gap-2 w-full">
                  <Skeleton className="h-4 w-1/2" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-28" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row gap-2 mt-3">
                <Skeleton className="h-8 w-28 rounded-md" />
                <Skeleton className="h-8 w-32 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Contact Button */}
      <Skeleton className="h-10 w-48 rounded-md" />
    </div>
  );
}
