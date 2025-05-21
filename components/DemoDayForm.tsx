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
import { useBrand } from "@/context/BrandContext";

const schema = z.object({
  name: z.string().min(1, "Required"),
  brand: z.string().min(1, "Required"),
  salesRep: z.string().min(1, "Required"),
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

type FormValues = z.infer<typeof schema>;

export function DemoDayForm() {
  const { brand } = useBrand();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      eventType: "Demo Day",
      brand,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      const notes = Object.entries(values)
        .map(([key, val]) => `${key.replace(/([A-Z])/g, " $1")}: ${val}`)
        .join("\n");

      // TODO: Replace with server action to create HubSpot task
      console.log("Submitting task note:\n", notes);

      toast.success("Task created successfully");
    } catch (err) {
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto"
    >
      {[
        { name: "name", label: "Name" },
        { name: "brand", label: "Brand", disabled: true },
        { name: "salesRep", label: "Sales Rep" },
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
        { name: "otherBrands", label: "Most Popular Products (Other Brands)" },
        {
          name: "optimizationOpportunities",
          label: "Brand Optimization Opportunities",
        },
      ].map(({ name, label, disabled }) => (
        <div key={name} className="flex flex-col gap-1">
          <Label htmlFor={name}>{label}</Label>
          <Input
            id={name}
            {...register(name as keyof FormValues)}
            disabled={disabled}
          />
          {errors[name as keyof FormValues] && (
            <p className="text-sm text-red-500">
              {errors[name as keyof FormValues]?.message}
            </p>
          )}
        </div>
      ))}

      {/* Full width on md+ screens */}
      <div className="md:col-span-2 flex flex-col gap-1">
        <Label htmlFor="eventNotes" className="mb-1">
          Event Notes
        </Label>
        <Textarea id="eventNotes" {...register("eventNotes")} rows={4} />
        {errors.eventNotes && (
          <p className="text-sm text-red-500">{errors.eventNotes.message}</p>
        )}
      </div>

      <div className="md:col-span-2 flex flex-col gap-1">
        <Label htmlFor="improvementAreas" className="mb-1">
          Areas for Improvement
        </Label>
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
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
