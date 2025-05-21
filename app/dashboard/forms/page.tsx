"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DemoDayForm } from "@/components/DemoDayForm";
import { GorillaMarketingForm } from "@/components/G-MarketingForm";

export default function Page() {
  return (
    <div className="p-4 w-full max-w-[1200px] mx-auto pt-8 md:pt-12">
      <Tabs defaultValue="demoDay" className="w-full p-2">
        <TabsList className="rounded-md mb-4 flex gap-2 dark:bg-[#161b22] border border-gray-200 dark:border-[#4493f8]/30">
          <TabsTrigger
            value="demoDay"
            className="rounded-sm dark:data-[state=active]:text-[#4493f8] dark:data-[state=active]:bg-blue-600/20 dark:data-[state=active]:border-[#4493f8] cursor-pointer"
          >
            Demo Day Form
          </TabsTrigger>
          <TabsTrigger
            value="gorillaMarketing"
            className="rounded-sm dark:data-[state=active]:text-[#4493f8] dark:data-[state=active]:bg-blue-600/20 dark:data-[state=active]:border-[#4493f8] cursor-pointer"
          >
            Gorilla Marketing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="demoDay">
          <DemoDayForm />
        </TabsContent>

        <TabsContent value="gorillaMarketing">
          <GorillaMarketingForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
