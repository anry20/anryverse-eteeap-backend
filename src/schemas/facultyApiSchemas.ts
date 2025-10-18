import z from "zod";

export const UpdateGradeSchema = z.object({
  grade: z
    .number()
    .min(0, { message: "Grade must be at least 0" })
    .max(100, { message: "Grade cannot exceed 100" }),
});
