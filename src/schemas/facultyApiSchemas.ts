import z from "zod";
import { CreateFacultySchema } from "./adminApiSchemas";

export const UpdateGradeSchema = z.object({
  grade: z
    .number()
    .min(0, { message: "Grade must be at least 0" })
    .max(100, { message: "Grade cannot exceed 100" }),
});

export const UpdateMyFacultyProfileSchema = CreateFacultySchema.omit({
  firstName: true,
  lastName: true,
  middleName: true,
  username: true,
})
  .partial()
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be updated",
  });

export type UpdateMyFacultyProfileSchema = z.infer<
  typeof UpdateMyFacultyProfileSchema
>;
