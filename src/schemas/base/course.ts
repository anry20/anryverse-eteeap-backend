import z from "zod";

export const CreateCourseSchema = z.object({
  courseName: z.string().min(1, "Course name is required"),
  department: z.string().min(1, "Department is required"),
});

export const UpdateCourseSchema = CreateCourseSchema.partial().refine(
  (data) => Object.values(data).some((v) => v !== undefined),
  { message: "At least one field must be updated" }
);

export type CreateCourseSchema = z.infer<typeof CreateCourseSchema>;
export type UpdateCourseSchema = z.infer<typeof UpdateCourseSchema>;
