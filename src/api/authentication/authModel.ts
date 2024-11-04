import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const LoginSchema = z.object({
  body: z.object({
    email: z.string().email("email is invalid"),
  }),
});

export const VerifyOTPSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    otp: z.string(),
  }),
});
