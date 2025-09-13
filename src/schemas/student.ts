import { z } from "zod";

export const CreateStudentSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  email: z.email("Invalid email address"),
  courseId: z.number().min(1, "Invalid course ID"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  middleName: z
    .string()
    .min(2, "Middle name must be at least 2 characters")
    .optional(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  dateEnrolled: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date")
    .transform((val) => new Date(val)),
  sex: z.enum(["Male", "Female"]),
  placeOfBirth: z.string().min(1, "Place of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  religion: z.string().min(1, "Religion is required"),
  contactNo: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Contact number must be valid"),
  civilStatus: z.enum(
    ["Single", "Married", "Widowed", "Separated", "Annulled", "Divorced"],
    "Civil status is required"
  ),
});

export const UpdateStudentSchema = CreateStudentSchema.omit({
  username: true,
  password: true,
  email: true,
})
  .partial()
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be updated",
  });

export type CreateStudentSchema = z.infer<typeof CreateStudentSchema>;
export type UpdateStudentSchema = z.infer<typeof UpdateStudentSchema>;
