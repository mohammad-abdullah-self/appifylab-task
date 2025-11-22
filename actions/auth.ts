"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";
import {
  LoginFormSchema,
  LoginState,
  RegisterFormSchema,
  FormState,
} from "@/app/lib/definitions";
import { createSession } from "@/app/lib/session";
import { deleteSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import * as z from "zod";

export async function register(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = RegisterFormSchema.safeParse({
    firstName: formData.get("first_name"),
    lastName: formData.get("last_name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  // 2. Prepare data for insertion into database
  const { firstName, lastName, email, password } = validatedFields.data;
  // e.g. Hash the user's password before storing it
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // 3. Insert the user into the database or call an Auth Library's API
  const data = await db
    .insert(users)
    .values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    })
    .returning({ id: users.id });

  const user = data[0];

  if (!user) {
    return {
      message: "An error occurred while creating your account.",
    };
  }

  // Current steps:
  // 4. Create user session
  await createSession(user.id);
  // 5. Redirect user
  redirect("/feed");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}

export async function login(state: LoginState, formData: FormData) {
  // Validate user credentials
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  // 1. Find user by email
  const user = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    return {
      message: "Invalid email or password.",
    };
  }

  // 2. Compare hashed password
  const isValid = await bcrypt.compare(password, user[0].password);

  if (!isValid) {
    return {
      message: "Invalid email or password.",
    };
  }

  // 3. Create session
  await createSession(user[0].id);

  // 4. Redirect to feed
  redirect("/feed");
}
