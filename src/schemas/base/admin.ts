import z from "zod";

export const CreateAdminSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.email("Invalid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  middleName: z
    .string()
    .min(2, "Middle name must be at least 2 characters")
    .optional(),
  contactNo: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Contact number must be valid"),
});

export const UpdateAdminSchema = CreateAdminSchema.omit({})
  .partial()
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be updated",
  });
export type CreateAdminSchema = z.infer<typeof CreateAdminSchema>;
export type UpdateAdminSchema = z.infer<typeof UpdateAdminSchema>;
