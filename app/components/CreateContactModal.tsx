"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";
import { useContactModal } from "@/context/ContactModalContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CreateContactModal() {
  const { open, setOpen, companyId } = useContactModal();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!companyId) return;

    setLoading(true);
    try {
      const res = await fetch("/api/hubspot/create-contact", {
        method: "POST",
        body: JSON.stringify({ ...form, companyId }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        // ✅ Clear form + close modal
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          jobTitle: "",
        });
        setOpen(false);

        // ✅ Refetch company data on server
        router.refresh();

        toast.success("Contact created successfully!");
      } else {
        toast.error("Failed to create contact. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Contact</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) =>
              setForm((f) => ({ ...f, firstName: e.target.value }))
            }
          />
          <Input
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) =>
              setForm((f) => ({ ...f, lastName: e.target.value }))
            }
          />
          <Input
            placeholder="Job Title"
            value={form.jobTitle}
            onChange={(e) =>
              setForm((f) => ({ ...f, jobTitle: e.target.value }))
            }
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create Contact"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
