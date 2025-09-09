import z from "zod";

export const CreateSubjectSchema = z.object({
  subjectCode: z.string().min(1, "Subject code is required"),
  subjectName: z.string().min(1, "Subject name is required"),
  description: z.string().optional(),
  units: z.number().min(1, "Units must be at least 1"),
});

export const UpdateSubjectSchema = CreateSubjectSchema.partial().refine(
  (data) => Object.values(data).some((v) => v !== undefined),
  { message: "At least one field must be updated" }
);

export type CreateSubjectSchema = z.infer<typeof CreateSubjectSchema>;
export type UpdateSubjectSchema = z.infer<typeof UpdateSubjectSchema>;
