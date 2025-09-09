import z from "zod";

export const CreateCourseSchema = z.object({
  courseName: z.string().min(1, "Course name is required"),
  description: z.string().optional(),
});

export const UpdateCourseSchema = CreateCourseSchema.partial();

export type CreateCourseSchema = z.infer<typeof CreateCourseSchema>;
export type UpdateCourseSchema = z.infer<typeof UpdateCourseSchema>;
