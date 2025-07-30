"use client";

import { useTransition, useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import Spinner from "@/components/Spinner";

import { logMeeting } from "@/app/actions/logMeeting";
import { useBrand } from "@/context/BrandContext";
import { useSavedContactContext } from "@/context/FetchAllSavedContext";
import { useContactContext } from "@/context/ContactContext";
import { HubSpotContactWithSaved } from "@/types/hubspot";
import { getStatusCounts } from "@/app/actions/getStatusCounts";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  newFirstName: z.string().min(1, "First name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  body: z.string().min(1, "Meeting notes are required"),
  l2Status: z.enum(["Visited", "Dropped Off"]),
});

type FormValues = z.infer<typeof formSchema>;

export function LogMeetingForm({
  contactId,
  contactFirstName,
  contactJobTitle,
  contactCompany,
  contactStatus,
  onSuccess,
}: {
  contactId: string;
  contactFirstName?: string;
  contactJobTitle?: string;
  contactCompany?: string;
  contactStatus?: string;
  onSuccess?: (meeting: any) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const { brand } = useBrand();
  const { data: session } = useSession(); // ✅ to get user email
  const userEmail = session?.user?.email;

  const {
    logMutate,
    setLogOpen,
    contactMutate,
    logContactData,
    updateContactInList,
    setStatusCounts,
  } = useContactContext();

  const { fetchAllSavedContacts } = useSavedContactContext();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newFirstName: contactFirstName || "",
      jobTitle: contactJobTitle || "",
      body: `1. Store Viability:
  - Can the store sustain LITTO products?
  - Does the store itself seem sustainable?

2. Competing Products:
  - What brands/products are prominent?
  - Note average price points and inventory trends (e.g., AIO-heavy, flower heavy, etc).

3. Sample Delivery:
  - Document whether a sample was provided.

4. Buyer Information:
  - Buyer availability: Day and time in-store
  - Name, phone number, and email of the buyer.

5. Additional Notes:
  - Highlight noteworthy details such as store staff reception, layout, or potential for future follow-ups.
`,

      l2Status: (["Visited", "Dropped Off"].includes(contactStatus || "")
        ? contactStatus
        : "Assigned") as FormValues["l2Status"],
    },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(() => {
      logMeeting({
        brand,
        contactId,
        title: `Met with ${values.newFirstName} at ${
          contactCompany ?? "Store"
        }`,
        body: values.body,
        newFirstName: values.newFirstName,
        jobTitle: values.jobTitle,
        l2Status: values.l2Status,
      })
        .then(async (meeting) => {
          toast.success("Meeting logged!");
          logMutate?.();
          contactMutate?.();
          setLogOpen(false);

          // ✅ Refetch from /api/saved-contacts-list if contact was dropped off
          if (values.l2Status === "Dropped Off") {
            await fetchAllSavedContacts();
          }

          // Refetch latest contact status
          if (["Visited", "Dropped Off"].includes(values.l2Status)) {
            const newCounts = await getStatusCounts(brand, userEmail ?? "");
            setStatusCounts(newCounts); // ✅ update counts in context
          }

          onSuccess?.(meeting);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to log meeting");
        });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="newFirstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact's First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobTitle"
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
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Notes</FormLabel>
              <FormControl>
                <Textarea rows={6} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="l2Status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <div className="space-y-2">
                {["Visited", "Dropped Off"].map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="l2Status"
                      value={status}
                      checked={field.value === status}
                      onChange={() => field.onChange(status)}
                      className="hidden peer"
                    />
                    <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex items-center justify-center peer-checked:border-green-400 peer-checked:bg-green-400">
                      <div className="w-2.5 h-2.5 rounded-full opacity-0 peer-checked:opacity-100 bg-white"></div>
                    </div>
                    <span className="capitalize">{status}</span>
                  </label>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <div className="flex items-center gap-1">
              <Spinner size="4" />
              Submitting
            </div>
          ) : (
            "Log Meeting"
          )}
        </Button>
      </form>
    </Form>
  );
}
