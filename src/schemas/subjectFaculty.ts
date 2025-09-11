import z from "zod";

export const assignFacultyToSubjectSchema = z.object({
  facultyId: z.number().min(1, "Valid Faculty ID is required"),
});

export type AssignFacultyToSubjectSchema = z.infer<
  typeof assignFacultyToSubjectSchema
>;
