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
import Spinner from "@/app/components/Spinner";
import toast from "react-hot-toast";

// Optional: logMeeting server action
import { logMeetingToHubSpot } from "@/app/actions/logMeetingToHubSpot"; // adjust path

type Props = {
  contactId: string;
  contactFirstName?: string;
  contactJobTitle?: string;
  contactStatus?: string;
  onSuccess?: (data: any) => void;
};

export function LogMeetingForm({
  contactId,
  contactFirstName = "",
  contactJobTitle = "",
  contactStatus = "",
  onSuccess,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<LogMeetingFormValues>({
    resolver: zodResolver(logMeetingSchema),
    defaultValues: {
      newFirstName: contactFirstName,
      jobTitle: contactJobTitle,
      body: defaultMeetingBody,
    },
  });

  const onSubmit = (values: LogMeetingFormValues) => {
    startTransition(async () => {
      try {
        const res = await logMeetingToHubSpot(contactId, values.body);
        console.log("server action result", res); // prove it resolved
        toast.success("Meeting logged!");
        form.reset();
        onSuccess?.(res);
      } catch (err) {
        console.error(err);
        toast.error("Failed to log meeting");
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
              Logging...
            </div>
          ) : (
            "Log Meeting"
          )}
        </Button>
      </form>
    </Form>
  );
}
