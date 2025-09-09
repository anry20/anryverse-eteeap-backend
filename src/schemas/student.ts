import { z } from "zod";

export const CreateStudentSchema = z.object({
  username: z.string(),
  password: z.string(),
  courseId: z.uuid(),
  firstName: z.string(),
  lastName: z.string(),
  middleInitial: z.string().length(1).optional(),
  address: z.string(),
  sex: z.enum(["Male", "Female"]),
  placeOfBirth: z.string(),
  nationality: z.string().optional(),
  religion: z.string().optional(),
  contactNo: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/)
    .optional(),
  civilStatus: z
    .enum(["Single", "Married", "Widowed", "Separated", "Annulled", "Divorced"])
    .optional(),
});

export const UpdateStudentSchema = CreateStudentSchema.omit({
  username: true,
  password: true,
}).partial();

export type CreateStudentSchema = z.infer<typeof CreateStudentSchema>;
export type UpdateStudentSchema = z.infer<typeof UpdateStudentSchema>;
