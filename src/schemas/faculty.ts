import z from "zod";

export const CreateFacultySchema = z.object({
  username: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().optional(),
  department: z.string().optional(),
});

export const UpdateFacultySchema = CreateFacultySchema.omit({})
  .partial()
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be updated",
  });
export type CreateFacultySchema = z.infer<typeof CreateFacultySchema>;
export type UpdateFacultySchema = z.infer<typeof UpdateFacultySchema>;
