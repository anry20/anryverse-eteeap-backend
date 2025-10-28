import z from "zod";

export const CreateFacultySchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.email("Invalid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  middleName: z
    .string()
    .min(2, "Middle name must be at least 2 characters")
    .optional(),
  contactNo: z.string().regex(/^09\d{9}$/, "Contact number must be valid"),
});

export type CreateFacultySchema = z.infer<typeof CreateFacultySchema>;

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
  sex: z.enum(["male", "female"]),
  placeOfBirth: z.string().min(1, "Place of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  religion: z.string().min(1, "Religion is required"),
  contactNo: z.string().regex(/^09\d{9}$/, "Contact number must be valid"),
  civilStatus: z.enum(
    ["single", "married", "widowed", "separated", "annulled", "divorced"],
    "Civil status is required"
  ),
});

export type CreateStudentSchema = z.infer<typeof CreateStudentSchema>;

export const CreateSubjectSchema = z.object({
  subjectCode: z.string().min(1, "Subject code is required"),
  subjectName: z.string().min(1, "Subject name is required"),
  units: z.number().min(1, "Units must be at least 1"),
});

export const UpdateSubjectSchema = CreateSubjectSchema.partial().refine(
  (data) => Object.values(data).some((v) => v !== undefined),
  { message: "At least one field must be updated" }
);

export type CreateSubjectSchema = z.infer<typeof CreateSubjectSchema>;
export type UpdateSubjectSchema = z.infer<typeof UpdateSubjectSchema>;
