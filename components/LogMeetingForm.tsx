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
import { useContactContext } from "@/context/ContactContext";

const formSchema = z.object({
  newFirstName: z.string().min(1, "First name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  body: z.string().min(1, "Meeting notes are required"),
  l2Status: z.enum(["pending visit", "visit requested by rep", "dropped off"]),
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
  const { logMutate, setLogOpen, contactMutate, logContactData  } = useContactContext();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newFirstName: contactFirstName || "",
      jobTitle: contactJobTitle || "",
      body: "",
      l2Status:
        (["pending visit", "visit requested by rep", "dropped off"].includes(contactStatus || "")
          ? contactStatus
          : "pending visit") as FormValues["l2Status"],
    },
  });

  // useEffect(() => {
  //   if (logContactData) {
  //     form.reset({
  //       newFirstName: logContactData.properties?.firstname || "",
  //       jobTitle: logContactData.properties?.jobtitle || "",
  //       body: "",
  //       l2Status:
  //         (["pending visit", "visit requested by rep", "dropped off"].includes(
  //           logContactData.properties?.l2_lead_status || ""
  //         )
  //           ? logContactData.properties?.l2_lead_status
  //           : "pending visit") as FormValues["l2Status"],
  //     });
  //   }
  // }, [logContactData, form]); // ✅ include form in deps

  const onSubmit = (values: FormValues) => {
    startTransition(() => {
      logMeeting({
        brand,
        contactId,
        title: `Met with ${values.newFirstName} at ${contactCompany ?? "Store"}`,
        body: values.body,
        newFirstName: values.newFirstName,
        jobTitle: values.jobTitle,
        l2Status: values.l2Status,
      })
        .then((meeting) => {
          toast.success("Meeting logged!");
          logMutate?.();
          contactMutate?.();
          setLogOpen(false);
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
                {["pending visit", "visit requested by rep", "dropped off"].map((status) => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
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
