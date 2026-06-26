import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const base = {
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters long"),
  gender: z.enum(["male", "female", "other"], {
    message: "Gender is required",
  }),
  age: z.number().int().min(1, "Age must be at least 1").max(100, "Age must be between 1 and 100"),
  role: z.enum(["admin", "user"]),
  status: z.enum(["active", "inactive"]),
};

export const createUserSchema = z.object({
  ...base,
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
  ...base,
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .optional()
    .or(z.literal("")),
  profileImage: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "Max file size is 5MB",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .jpeg, .png and .webp formats are supported",
    }),
});

export type EditUserFormData = z.infer<typeof editUserSchema>;
