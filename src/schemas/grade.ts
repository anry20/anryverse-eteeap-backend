import z from "zod";

export const AssignGradeSchema = z.object({
  enrollmentId: z.number().int().positive(),
  grade: z.number().min(0).max(100),
});

export const UpdateGradeSchema = AssignGradeSchema.partial().refine(
  (data) => Object.values(data).some((v) => v !== undefined),
  {
    message: "At least one field must be updated",
  }
);

export type AssignGradeSchema = z.infer<typeof AssignGradeSchema>;
export type UpdateGradeSchema = z.infer<typeof UpdateGradeSchema>;
