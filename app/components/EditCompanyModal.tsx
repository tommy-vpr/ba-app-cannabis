// app/components/EditCompanyModal.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { IconPencil } from "@tabler/icons-react";
import type { Company } from "@/types/company";
import { updateCompany } from "@/app/actions/updateCompany";

type Props = {
  company: Company;
  className?: string;
};

export default function EditCompanyModal({ company, className }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // default to empty string for nullable fields so inputs are controlled
  const [form, setForm] = useState({
    name: company.name ?? "",
    legal_business_name: company.legal_business_name ?? "",
    phone: company.phone ?? "",
    address: company.address ?? "",
    city: company.city ?? "",
    state: company.state ?? "",
    zip: company.zip ?? "",
    county: company.county ?? "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = () => {
    setError(null);
    startTransition(async () => {
      try {
        // send empty strings as null to "clear" fields in HubSpot
        const sanitize = (v: string) => (v === "" ? null : v);

        await updateCompany(company.id, {
          name: sanitize(form.name),
          legal_business_name: sanitize(form.legal_business_name),
          phone: sanitize(form.phone),
          address: sanitize(form.address),
          city: sanitize(form.city),
          state: sanitize(form.state),
          zip: sanitize(form.zip),
          county: sanitize(form.county),
        });

        setOpen(false);
        router.refresh(); // refresh the server-rendered page
      } catch (e: any) {
        setError(e?.message || "Failed to update company.");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        className={
          className ??
          "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer transition duration-200"
        }
        aria-label="Edit company"
        title="Edit company"
      >
        <IconPencil size={21} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Company Info</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Name"
            />
            <Input
              name="legal_business_name"
              value={form.legal_business_name}
              onChange={onChange}
              placeholder="Legal Business Name"
            />
            <Input
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="Phone"
            />
            <Input
              name="address"
              value={form.address}
              onChange={onChange}
              placeholder="Address"
            />
            <Input
              name="city"
              value={form.city}
              onChange={onChange}
              placeholder="City"
            />
            <Input
              name="state"
              value={form.state}
              onChange={onChange}
              placeholder="State"
            />
            <Input
              name="zip"
              value={form.zip}
              onChange={onChange}
              placeholder="ZIP"
            />
            <Input
              name="county"
              value={form.county}
              onChange={onChange}
              placeholder="County"
            />
          </div>

          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
