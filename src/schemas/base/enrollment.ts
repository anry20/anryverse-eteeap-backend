import z from "zod";

export const EnrollmentSchema = z.object({
  studentId: z.number().int().positive("Student ID must be a positive integer"),
  subjectCode: z.string().min(1, "Subject code is required"),
  facultyId: z.number().int().positive("Faculty ID must be a positive integer"),
  termId: z.number().int().positive("Term ID must be a positive integer"),
});

export type EnrollmentSchema = z.infer<typeof EnrollmentSchema>;

export const ChangeEnrollmentStatusSchema = z.object({
  studentId: z.number().int().positive("Student ID must be a positive integer"),
  enrollmentStatus: z.enum(["enrolled", "dropped", "completed"]),
});

export type ChangeEnrollmentStatusSchema = z.infer<
  typeof ChangeEnrollmentStatusSchema
>;
