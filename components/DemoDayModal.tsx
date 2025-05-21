"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBrand } from "@/context/BrandContext";

import { createDemoDayTask } from "@/app/actions/createDemoDayTask"; // adjust path
import { useDemoDayModal } from "@/context/DemoDayContext";

const schema = z.object({
  name: z.string().min(1, "Required"),
  brand: z.string().min(1, "Required"),
  hubspotOwnerId: z.string(),
  eventType: z.literal("Demo Day"),
  location: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  startingInventory: z.string().min(1),
  endingInventory: z.string().min(1),
  unitsSold: z.string().min(1),
  totalCustomers: z.string().min(1),
  returningCustomers: z.string().min(1),
  promos: z.string().min(1),
  itemsCustomersBuying: z.string().min(1),
  otherBrands: z.string().min(1),
  optimizationOpportunities: z.string().min(1),
  eventNotes: z.string().min(1),
  improvementAreas: z.string().min(1),
});

export type DemoDayFormValues = z.infer<typeof schema>;

export function DemoDayModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const { brand } = useBrand();
  const [loading, setLoading] = useState(false);

  const { demoContactData } = useDemoDayModal();
  const contactId = demoContactData?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DemoDayFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      eventType: "Demo Day",
      brand,
      //   salesRep,
    },
  });

  const onSubmit = async (values: DemoDayFormValues) => {
    console.log("✅ Submitted values:", values);
    try {
      setLoading(true);
      await createDemoDayTask(brand, {
        ...values,
        contactId: contactId!,
        hubspotOwnerId: values.hubspotOwnerId, // already included
      });

      toast.success("Task created successfully");
      setOpen(false);
    } catch (err) {
      console.error("❌ Submission error:", err);
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-semibold">Demo Day</DialogTitle>
          <p className="text-gray-400 leading-5">
            Please fill out this form after completing a Demo Day/PAD,
            Store-To-Store, or other event.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <input
            type="hidden"
            {...register("hubspotOwnerId")}
            value={demoContactData?.properties.hubspot_owner_id ?? ""}
          />
          {[
            { name: "name", label: "Name" },
            { name: "brand", label: "Brand", disabled: true },
            // { name: "salesRep", label: "Sales Rep" },
            { name: "eventType", label: "Event Name/Type", disabled: true },
            { name: "location", label: "Store/Distro/Event Location" },
            { name: "state", label: "State" },
            { name: "startingInventory", label: "Starting Inventory" },
            { name: "endingInventory", label: "Ending Inventory" },
            { name: "unitsSold", label: "Units Sold" },
            { name: "totalCustomers", label: "Total Number of Customers" },
            { name: "returningCustomers", label: "Any Returning Customers" },
            { name: "promos", label: "Promos/Discounts Offered" },
            {
              name: "itemsCustomersBuying",
              label: "What Items Customers Are Buying",
            },
            {
              name: "otherBrands",
              label: "Most Popular Products (Other Brands)",
            },
            {
              name: "optimizationOpportunities",
              label: "Brand Optimization Opportunities",
            },
          ].map(({ name, label, disabled }) => (
            <div key={name} className="flex flex-col gap-1">
              <Label htmlFor={name}>{label}</Label>
              <Input
                id={name}
                {...register(name as keyof DemoDayFormValues)}
                disabled={disabled}
              />

              {errors[name as keyof DemoDayFormValues] && (
                <p className="text-sm text-red-500">
                  {errors[name as keyof DemoDayFormValues]?.message}
                </p>
              )}
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <Label htmlFor="eventNotes">Event Notes</Label>
            <Textarea id="eventNotes" {...register("eventNotes")} rows={4} />
            {errors.eventNotes && (
              <p className="text-sm text-red-500">
                {errors.eventNotes.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="improvementAreas">Areas for Improvement</Label>
            <Textarea
              id="improvementAreas"
              {...register("improvementAreas")}
              rows={4}
            />
            {errors.improvementAreas && (
              <p className="text-sm text-red-500">
                {errors.improvementAreas.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={loading} className="px-8">
              {loading ? "Submitting..." : "Submit Demo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
