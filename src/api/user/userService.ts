import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { type Prisma, PrismaClient } from "@prisma/client";

export class UserService {
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient = new PrismaClient()) {
    this.prismaClient = prismaClient;
  }

  // Retrieves all users from the database
  async findAll(): Promise<ServiceResponse<Prisma.UserSelectScalar[] | null>> {
    try {
      const users = await this.prismaClient.user.findMany();
      if (!users || users.length === 0) {
        return ServiceResponse.failure("No Users found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Prisma.UserSelectScalar[]>(
        "Users found",
        users as unknown as Prisma.UserSelectScalar[],
      );
    } catch (ex) {
      const errorMessage = `Error finding all users: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving users.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieves a single user by their ID
  async findById(id: number): Promise<ServiceResponse<Prisma.UserSelectScalar | null>> {
    try {
      const user = await this.prismaClient.user.findUnique({ where: { id } });
      if (!user) {
        return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Prisma.UserSelectScalar>("User found", user as unknown as Prisma.UserSelectScalar);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const userService = new UserService();
