"use client";

import { useContactContext } from "@/context/ContactContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";
import { updateContact } from "@/app/actions/updateContact"; // make sure this is imported

export function EditContactModal() {
  const {
    selectedContact,
    editOpen,
    setEditOpen,
    optimisticUpdate,
    fetchPage,
    page,
    contactMutate,
  } = useContactContext();

  const [form, setForm] = useState({
    StoreName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill on contact change
  useEffect(() => {
    if (selectedContact) {
      setForm({
        StoreName: selectedContact.properties.company ?? "",
        email: selectedContact.properties.email ?? "",
        phone: selectedContact.properties.phone ?? "",
        address: selectedContact.properties.address ?? "",
        city: selectedContact.properties.city ?? "",
        state: selectedContact.properties.state ?? "",
        zip: selectedContact.properties.zip ?? "",
      });
    }
  }, [selectedContact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!selectedContact) return;

    setIsSubmitting(true);

    const updates = {
      company: form.StoreName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state,
      zip: form.zip,
    };

    try {
      // Optimistically update
      optimisticUpdate(selectedContact.id, updates);

      // Await real server update
      await updateContact(selectedContact.id, updates, "litto");

      if (contactMutate) contactMutate();

      fetchPage(page); // <-- Add this here

      // Close modal
      setEditOpen(false);
    } catch (err) {
      console.error("❌ Update failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent className="sm:max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          {Object.entries(form).map(([key, value]) => (
            <div key={key} className="grid gap-1">
              <label
                htmlFor={key}
                className="text-sm font-medium capitalize text-muted-foreground"
              >
                {key}
              </label>
              <Input
                id={key}
                name={key}
                value={value}
                onChange={handleChange}
              />
            </div>
          ))}
          <Button
            onClick={handleSubmit}
            className="w-full mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner size="4" /> Updating
              </>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
