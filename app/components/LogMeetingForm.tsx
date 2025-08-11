"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import {
  logMeetingSchema,
  LogMeetingFormValues,
} from "@/lib/validation/logMeetingSchema";
import { defaultMeetingBody } from "@/lib/constants/meetingTemplate";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"; // ⬅️ ShadCN radio group
import Spinner from "@/app/components/Spinner";
import toast from "react-hot-toast";

import { logMeetingToHubSpot } from "@/app/actions/logMeetingToHubSpot";
import { updateAssociatedCompanyLeadStatusL2 } from "@/app/actions/updateAssociatedCompanyLeadStatusL2"; // ⬅️ new action
import { useRouter } from "next/navigation";
import { useCannabisCompanies } from "@/context/CompanyContext";

type LeadStatus = "Visited" | "Dropped Off" | "Not Started";

type Props = {
  contactId: string;
  contactFirstName?: string;
  contactJobTitle?: string;
  /** The *company's* current lead_status_l2 for this contact’s associated company */
  companyLeadStatusL2?: LeadStatus | null; // ⬅️ pass from server if you can
  onSuccess?: (data: any) => void;
};

export function LogMeetingForm({
  contactId,
  contactFirstName = "",
  contactJobTitle = "",
  companyLeadStatusL2 = "Not Started",
  onSuccess,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { refetchCurrentPage } = useCannabisCompanies();

  const form = useForm<LogMeetingFormValues>({
    resolver: zodResolver(logMeetingSchema),
    defaultValues: {
      newFirstName: contactFirstName,
      jobTitle: contactJobTitle,
      body: defaultMeetingBody,
      leadStatusL2: (companyLeadStatusL2 ?? "Not Started") as LeadStatus, // ⬅️ prefill
    },
  });

  const onSubmit = (values: LogMeetingFormValues) => {
    startTransition(async () => {
      try {
        const [logRes, statusRes] = await Promise.all([
          logMeetingToHubSpot(contactId, values.body),
          updateAssociatedCompanyLeadStatusL2(contactId, values.leadStatusL2),
        ]);

        toast.success("Meeting logged & status updated!");

        // 🔄 Make the company list latest:
        await refetchCurrentPage();
        router.refresh(); // optional SSR revalidation

        onSuccess?.({ logRes, statusRes });
        form.reset({
          newFirstName: "",
          jobTitle: "",
          body: defaultMeetingBody,
          leadStatusL2: values.leadStatusL2,
        });
      } catch (e) {
        console.error(e);
        toast.error("Failed to submit. Try again.");
      }
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. John" {...field} />
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
                <Input placeholder="e.g. Buyer, Manager" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 👇 Radio buttons for associated company lead_status_l2 */}
        <FormField
          control={form.control}
          name="leadStatusL2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sample Status</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                >
                  <label className="flex items-center gap-2 rounded-md border p-2 cursor-pointer">
                    <RadioGroupItem value="Visited" id="status-visited" />
                    <span>Visited</span>
                  </label>

                  <label className="flex items-center gap-2 rounded-md border p-2 cursor-pointer">
                    <RadioGroupItem value="Dropped Off" id="status-dropped" />
                    <span>Dropped Off</span>
                  </label>

                  <label className="flex items-center gap-2 rounded-md border p-2 cursor-pointer">
                    <RadioGroupItem
                      value="Not Started"
                      id="status-notstarted"
                    />
                    <span>Not Started</span>
                  </label>
                </RadioGroup>
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

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <div className="flex items-center gap-2">
              <Spinner size="4" />
              Saving...
            </div>
          ) : (
            "Save"
          )}
        </Button>
      </form>
    </Form>
  );
}
