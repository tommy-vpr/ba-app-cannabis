import { SkeletonCard } from "@/components/skeleton/SkeletonCard";

// app/dashboard/saved-contacts/loading.tsx
export default function Loading() {
  return (
    <div className="p-4 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4">Saved Contacts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
