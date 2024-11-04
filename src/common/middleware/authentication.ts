import { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { PrismaClient } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        id: number;
      };
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      const response = ServiceResponse.failure("Authentication token is required", null, StatusCodes.UNAUTHORIZED);
      return handleServiceResponse(response, res);
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId },
      select: { id: true, userId: true },
    });

    if (!user) {
      const response = ServiceResponse.failure("User not found", null, StatusCodes.UNAUTHORIZED);
      return handleServiceResponse(response, res);
    }

    req.user = user;
    next();
  } catch (error) {
    const response = ServiceResponse.failure("Invalid token", null, StatusCodes.UNAUTHORIZED);
    return handleServiceResponse(response, res);
  }
};
