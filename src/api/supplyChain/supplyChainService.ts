import { ServiceResponse } from "@/common/models/serviceResponse";
import { PrismaClient, type SupplyChainEvent } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import type { CreateSupplyChainEventInput } from "./supplyChainModel";

const prisma = new PrismaClient();

export class SupplyChainService {
  async createEvent(
    input: CreateSupplyChainEventInput,
    ownerId: number,
  ): Promise<ServiceResponse<SupplyChainEvent> | ServiceResponse<null>> {
    try {
      const event = await prisma.supplyChainEvent.create({
        data: {
          productName: input.productName,
          originLocation: input.originLocation,
          destinationLocation: input.destinationLocation,
          productType: input.productType,
          weight: input.weight,
          otherProductData: input.otherProductData,
          numberOfExchanges: input.numberOfExchanges,
          expectedDeliveryDate: new Date(input.expectedDeliveryDate),
          insuranceProvider: input.insuranceProvider ?? "",
          coverageType: input.coverageType ?? "",
          ownerId,
          participants: {
            create: input.participants.map((participant) => ({
              name: participant.name,
              contactInformation: JSON.stringify(participant.contactInformation),
              role: participant.role,
            })),
          },
        },
        include: {
          participants: true,
        },
      });

      return ServiceResponse.success("Supply chain event created successfully", event, StatusCodes.CREATED);
    } catch (error) {
      return ServiceResponse.failure("Failed to create supply chain event", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const supplyChainService = new SupplyChainService();
