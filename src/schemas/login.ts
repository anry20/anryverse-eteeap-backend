import z from "zod";

export const LoginSchema = z.object({
  credential: z.string().min(3),
  password: z.string().min(6),
});

export type LoginSchema = z.infer<typeof LoginSchema>;
