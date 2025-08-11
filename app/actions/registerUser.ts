// app/actions/registerUser.ts
"use server";

import { UserSignupSchema, UserSignupValues } from "@/lib/schemas"; // Adjust path
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { upsertBaEmailOption } from "./upsertBaEmailOption";

export async function registerUser(data: UserSignupValues) {
  // ✅ 1. Validate data with Zod on the server
  const parsed = UserSignupSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid form data.");
  }

  // ✅ 2. Verify secret key
  if (data.secretKey !== process.env.BA_SIGNUP_SECRET) {
    throw new Error("Invalid signup key.");
  }

  // ✅ 3. Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email already in use.");
  }

  // Make the email available as a dropdown option to ALL companies
  try {
    await upsertBaEmailOption(data.email);
  } catch (err) {
    console.error("Failed to upsert global ba_email option:", err);
    // Optional: do not fail signup on HubSpot hiccup
  }

  // ✅ 4. Create user
  await prisma.user.create({
    data: {
      email: data.email,
      password: await hash(data.password, 12),
      firstName: data.firstName,
      lastName: data.lastName,
      state: data.state,
      role: "user", // or 'admin' based on your flow
    },
  });
}
