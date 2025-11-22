import * as z from "zod";

export const RegisterFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { error: "Name must be at least 2 characters long." })
    .trim(),
  lastName: z
    .string()
    .min(2, { error: "Name must be at least 2 characters long." })
    .trim(),
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(6, { error: "Be at least 6 characters long" })
    .trim(),
});

export type FormState =
  | {
      errors?: {
        firstName?: string[];
        lastName?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export const LoginFormSchema = z.object({
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z.string().min(1, "Password is required").trim(),
});

export type LoginState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type SessionPayload = {
  userId: number;
  expiresAt: Date;
};
