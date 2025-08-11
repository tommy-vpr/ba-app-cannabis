import { ContactDetailSkeleton } from "@/app/components/skeleton/ContactDetailSkeleton";
import { SkeletonCompanyList } from "@/app/components/skeleton/SkeletonCompanyList";
import React from "react";

const loading = () => {
  return (
    <div className="p-4 w-full max-w-[1200px] mx-auto">
      <SkeletonCompanyList />
    </div>
  );
};

export default loading;
