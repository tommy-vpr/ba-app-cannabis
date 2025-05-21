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
  eventType: z.literal("Guerilla Marketing"),
  location: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  marketingType: z.string().min(1, "Required"),
  materialsUsed: z.string().min(1, "Required"),
  engagementStrategies: z.string().min(1, "Required"),
  eventReach: z.string().min(1, "Required"),
  eventNotes: z.string().min(1, "Required"),
  improvementAreas: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof schema>;

export function GorillaMarketingForm() {
  const { brand } = useBrand();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      eventType: "Guerilla Marketing",
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: "name", label: "Name" },
          { name: "brand", label: "Brand", disabled: true },
          { name: "salesRep", label: "Sales Rep" },
          { name: "eventType", label: "Event Name/Type", disabled: true },
          { name: "location", label: "Store/Distro/Event Location" },
          { name: "state", label: "State" },
          {
            name: "marketingType",
            label: "Type of Guerilla Marketing Activity",
          },
          { name: "materialsUsed", label: "Materials/Promotional Items Used" },
          { name: "engagementStrategies", label: "Engagement Strategies" },
          { name: "eventReach", label: "Event Reach (Estimate)" },
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
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="eventNotes">Event Notes</Label>
        <Textarea id="eventNotes" {...register("eventNotes")} rows={4} />
        {errors.eventNotes && (
          <p className="text-sm text-red-500">{errors.eventNotes.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="improvementAreas">Areas For Improvement</Label>
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

      <Button type="submit" disabled={loading} className="px-8">
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
