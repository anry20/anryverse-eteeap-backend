import { z } from "zod";
import { CreateStudentSchema } from "./adminApiSchemas";

export const UpdateMyStudentProfileSchema = CreateStudentSchema.omit({
  dateEnrolled: true,
  username: true,
  courseId: true,
  firstName: true,
  lastName: true,
  middleName: true,
  placeOfBirth: true,
  sex: true,
})
  .partial()
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be updated",
  });

export type UpdateMyStudentProfileSchema = z.infer<
  typeof UpdateMyStudentProfileSchema
>;
