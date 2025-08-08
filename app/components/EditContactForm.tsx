"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import { updateContact } from "@/app/actions/updateContact";

import { useContactModal } from "@/context/ContactModalContext";

import { editFormSchema, EditContactFormValues } from "@/types/EditForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "./Spinner";

type Props = {
  contactId: string;
  defaultValues: EditContactFormValues;
  onSuccess?: () => void;
};

export function EditContactForm({
  contactId,
  defaultValues,
  onSuccess,
}: Props) {
  const form = useForm<EditContactFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: EditContactFormValues) => {
    setLoading(true);
    try {
      await updateContact(contactId, values);
      toast.success("Contact updated");

      router.refresh();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update contact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="firstname"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="lastname"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="phone"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="jobtitle"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Spinner size="4" /> : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
