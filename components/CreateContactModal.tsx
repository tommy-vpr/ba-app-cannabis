"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Spinner from "./Spinner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { createNewContact } from "@/app/actions/createNewContact";
import { CreateContactFormValues, CreateContactSchema } from "@/lib/schemas";
import { states } from "@/lib/states";

import { useClearFiltersAndRedirect } from "@/hooks/useClearFiltersAndRedirect";
import { useContactContext } from "@/context/ContactContext";
import { StatusKey } from "@/types/status";

export function CreateContactModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    setQuery,
    setSelectedZip,
    setSelectedStatus,
    setPage,
    setCursors,
    setLocalQuery,
    setLocalZip,
    fetchPage,
    setStatusCounts,
  } = useContactContext();
  const clearFiltersAndRedirect = useClearFiltersAndRedirect();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateContactFormValues>({
    resolver: zodResolver(CreateContactSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      jobtitle: "",
      email: "",
      company: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
    },
  });

  function isStatusKey(value: string): value is StatusKey {
    return Object.values(StatusKey).includes(value as StatusKey);
  }

  const onSubmit = async (values: CreateContactFormValues) => {
    setLoading(true);
    try {
      const res = await createNewContact(values);
      if (!res.success || !res.contact) throw new Error(res.message);

      toast.success("Contact created");
      reset();
      setOpen(false);

      // 🧼 Clear filters
      setQuery("");
      setLocalQuery("");
      setSelectedZip(null);
      setLocalZip("");
      setSelectedStatus("all");
      setPage(1);
      setCursors({});

      startTransition(async () => {
        await fetchPage(1, "all", "");
      });

      router.replace("/dashboard");

      const rawStatus = res.contact.properties.lead_status?.toLowerCase() ?? "";
      const statusKey = isStatusKey(rawStatus) ? rawStatus : StatusKey.Assigned;

      setStatusCounts((prev) => ({
        ...prev,
        [StatusKey.All]: prev[StatusKey.All] + 1,
        [statusKey]: (prev[statusKey] ?? 0) + 1,
      }));
    } catch (err: any) {
      toast.error(err.message || "Failed to create contact");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    if (value.length > 6)
      value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`;
    else if (value.length > 3) value = `${value.slice(0, 3)}-${value.slice(3)}`;
    setValue("phone", value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg sm:max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Contact</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {[
            "firstname",
            "lastname",
            "jobtitle",
            "email",
            "company",
            "address",
            "city",
            "zip",
          ].map((field) => (
            <div key={field}>
              <Label htmlFor={field} className="mb-2">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Label>
              <Input
                id={field}
                type="text"
                {...register(field as keyof CreateContactFormValues)}
              />
              {errors[field as keyof CreateContactFormValues] && (
                <p className="text-sm text-red-500">
                  {errors[field as keyof CreateContactFormValues]?.message}
                </p>
              )}
            </div>
          ))}

          <div>
            <Label htmlFor="state" className="mb-2">
              State
            </Label>
            <select
              id="state"
              {...register("state")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-[#0d1117]"
            >
              <option value="">Select State</option>
              {states.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="text-sm text-red-500">{errors.state.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="mb-2">
              Phone
            </Label>
            <Input
              id="phone"
              value={watch("phone")}
              onChange={handlePhoneChange}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="4" /> Saving
              </>
            ) : (
              "Create Contact"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
