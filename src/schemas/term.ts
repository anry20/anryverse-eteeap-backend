import z from "zod";

export const CreateTermSchema = z.object({
  academicYear: z.string(),
  semester: z.enum(["First", "Second"]),
  isActive: z.boolean().optional().default(false),
});

export const UpdateTermSchema = CreateTermSchema.partial().refine(
  (data) => Object.values(data).some((v) => v !== undefined),
  { message: "At least one field must be updated" }
);

export type CreateTermSchema = z.infer<typeof CreateTermSchema>;
export type UpdateTermSchema = z.infer<typeof UpdateTermSchema>;
