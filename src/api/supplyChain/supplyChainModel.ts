import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

const ProductType = z.enum(["AGRICULTURE", "PHARMACEUTICAL", "CREATIVE", "MANUFACTURING"]);
const ParticipantRole = z.enum([
  "FARMER",
  "TRANSPORTER",
  "RETAILER",
  "ADMINISTRATOR",
  "QUALITY_INSPECTOR",
  "WAREHOUSE_OPERATOR",
]);

const ParticipantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactInformation: z.object({
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
  }),
  role: ParticipantRole,
});
export const CreateSupplyChainEventInputZodType = z.object({
  productName: z.string().min(1, "Product name is required"),
  originLocation: z.string().min(1, "Origin location is required"),
  destinationLocation: z.string().min(1, "Destination location is required"),
  productType: ProductType,
  weight: z.number().positive("Weight must be positive"),
  otherProductData: z.string().optional(),
  numberOfExchanges: z.number().int().positive("Number of exchanges must be positive"),
  expectedDeliveryDate: z.string().datetime(),
  insuranceProvider: z.string().optional(),
  coverageType: z.string().optional(),
  participants: z.array(ParticipantSchema).min(1, "At least one participant is required"),
});

export const CreateSupplyChainEventSchema = z.object({
  body: CreateSupplyChainEventInputZodType,
});

export type CreateSupplyChainEventInput = z.infer<typeof CreateSupplyChainEventSchema>["body"];
