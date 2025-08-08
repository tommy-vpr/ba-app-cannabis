import { z } from "zod";

export const editFormSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().optional(),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  jobtitle: z.string().optional(),
});

export type EditContactFormValues = z.infer<typeof editFormSchema>;
