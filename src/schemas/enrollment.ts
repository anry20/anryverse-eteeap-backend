import { z } from "zod";

export const EnrollStudentSchema = z.object({
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

export type EnrollStudentSchema = z.infer<typeof EnrollStudentSchema>;
