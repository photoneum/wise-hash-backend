import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { authenticateToken } from "@/common/middleware/authentication";
import { validateRequest } from "@/common/utils/httpHandlers";
import { supplyChainController } from "./supplyChainController";
import { CreateSupplyChainEventInputZodType, CreateSupplyChainEventSchema } from "./supplyChainModel";

export const supplyChainRegistry = new OpenAPIRegistry();

supplyChainRegistry.register("CreateSupplyChainEvent", CreateSupplyChainEventInputZodType);

export const supplyChainRouter: Router = express.Router();
const bearerAuth = supplyChainRegistry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

supplyChainRegistry.registerPath({
  method: "post",
  path: "/supply-chain",
  tags: ["Supply Chain"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateSupplyChainEventSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(z.any(), "Supply chain event created successfully", 201),
});

supplyChainRouter.post(
  "/",
  authenticateToken,
  validateRequest(CreateSupplyChainEventSchema),
  supplyChainController.createEvent,
);
