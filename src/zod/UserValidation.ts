import z from "zod";

export const signupBody = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(6),
});

export const signinBody = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
