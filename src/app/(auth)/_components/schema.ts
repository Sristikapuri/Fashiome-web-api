import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string("Full Name must be string")
    .min(2, "Full Name must be at least 2 characters long"),
  email: z.email("Invalid email address"),
  gender: z.enum(["male", "female", "other"], {
    message: "Gender is required"
  }),
  age: z.string("Age must be string")
    .refine((val) => !isNaN(parseInt(val)), "Age must be a number")
    .refine((val) => parseInt(val) >= 1 && parseInt(val) <= 100, "Age must be between 1 and 100"),
  password: z.string("Password must be string")
    .min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string("Confirm Password must be string")
    .min(6, "Confirm Password must be at least 6 characters long")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string("Password must be string")
    .min(6, "Password must be at least 6 characters long")
});

export type LoginFormData = z.infer<typeof loginSchema>;
