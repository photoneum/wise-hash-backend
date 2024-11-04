import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { authController } from "./authController";
import { LoginSchema, VerifyOTPSchema } from "./authModel";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.register("Login", LoginSchema);
authRegistry.register("VerifyOTP", VerifyOTPSchema);

authRegistry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Authentication"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginSchema,
        },
      },
    },
  },
  responses: createApiResponse(z.any(), "Success"),
});

authRouter.post("/login", validateRequest(LoginSchema), authController.login);

authRegistry.registerPath({
  method: "post",
  path: "/auth/verify-otp",
  tags: ["Authentication"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: VerifyOTPSchema,
        },
      },
    },
  },
  responses: createApiResponse(
    z.object({
      token: z.string(),
    }),
    "Success",
  ),
});

authRouter.post("/verify-otp", validateRequest(VerifyOTPSchema), authController.verifyOTP);
