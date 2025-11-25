"use server";

import { eq, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import bcrypt from "bcrypt";
import {
  LoginFormSchema,
  LoginState,
  RegisterFormSchema,
  RegisterState,
} from "@/app/lib/definitions";
import { createSession } from "@/app/lib/session";
import { deleteSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import * as z from "zod";
import { verifySession } from "@/app/lib/dal";

export async function registerAction(state: RegisterState, formData: FormData) {
  const validatedFields = RegisterFormSchema.safeParse({
    firstName: formData.get("first_name"),
    lastName: formData.get("last_name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const { firstName, lastName, email, password } = validatedFields.data;
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const [user] = await db
    .insert(Users)
    .values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    })
    .returning({ id: Users.id });

  if (!user) {
    return {
      message: "An error occurred while creating your account.",
    };
  }

  await createSession(user.id);
  redirect("/feed");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}

export async function loginAction(state: LoginState, formData: FormData) {
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

  const [user] = await db
    .select({
      id: Users.id,
      password: Users.password,
    })
    .from(Users)
    .where(eq(Users.email, email));

  if (!user) {
    return {
      message: "Invalid email or password.",
    };
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return {
      message: "Invalid email or password.",
    };
  }

  await createSession(user.id);

  redirect("/feed");
}

export async function getAuthUserFullName() {
  const session = await verifySession();
  if (!session?.userId) throw new Error("Not authenticated");

  const [user] = await db
    .select({
      fullName: sql<string>`concat(${Users.firstName}, ' ', ${Users.lastName})`,
    })
    .from(Users)
    .where(eq(Users.id, session.userId));

  return user.fullName;
}
