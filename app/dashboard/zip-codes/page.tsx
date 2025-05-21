import { ZipCodes } from "@/components/ZipCodes";
import React from "react";

const page = () => {
  return (
    <div className="p-4 w-full max-w-[1200px] mx-auto pt-12">
      <h1 className="dark:text-gray-200 text-2xl font-semibold mb-4">
        Zip Codes
      </h1>
      <div className="">
        <ZipCodes brand="litto-cannabis" />
      </div>
    </div>
  );
};

export default page;
