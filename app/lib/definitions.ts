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

export type RegisterState =
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

export type CreatePostState =
  | {
      errors?: {
        content?: string[];
        image?: string[];
      };
      message?: string;
    }
  | undefined;

export const CreatePostSchema = z.object({
  content: z.string().min(1, "Content is required"),
  image: z
    .any()
    .refine((file) => {
      if (!file) return true;
      if (!(file instanceof File)) return false;
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      return allowedTypes.includes(file.type);
    }, "Invalid image type. Only JPG, PNG, WEBP allowed")
    .refine((file) => {
      if (!file) return true;
      const maxSize = 5 * 1024 * 1024;
      return file.size <= maxSize;
    }, "Image size must be less than 5MB")
    .optional(),
  isPrivate: z
    .preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return val;
    }, z.boolean())
    .optional(),
});

export const CreateCommentSchema = z.object({
  postId: z
    .union([z.string(), z.number()])
    .transform((val) => {
      const num = typeof val === "string" ? Number(val) : val;
      if (isNaN(num)) throw new Error("Must be a numeric value");
      return num;
    })
    .pipe(z.number().int().positive()),
  content: z.string().min(1, "Content is required"),
});

export type CreateCommentState =
  | {
      errors?: {
        content?: string[];
        postId?: number[];
      };
      message?: string;
    }
  | undefined;

export const CreateReplySchema = CreateCommentSchema.extend({
  parentId: z
    .union([z.string(), z.number()])
    .transform((val) => {
      const num = typeof val === "string" ? Number(val) : val;
      if (isNaN(num)) throw new Error("Must be a numeric value");
      return num;
    })
    .pipe(z.number().int().positive()),
});

export type CreateCommentReplyState =
  | {
      errors?: {
        content?: string[];
        postId?: number[];
        parentId?: number[];
      };
      message?: string;
    }
  | undefined;
