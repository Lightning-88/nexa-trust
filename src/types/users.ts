import z from "zod";

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  rememberMe: z.boolean(),
});

export const registerUserSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(8),
});

export type loginUserType = z.infer<typeof loginUserSchema>;
export type registerUserType = z.infer<typeof registerUserSchema>;
