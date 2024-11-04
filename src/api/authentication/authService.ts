import { randomBytes, randomUUID } from "node:crypto";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { emailService } from "@/common/services/emailService";
import { env } from "@/common/utils/envConfig";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export class AuthService {
  private generateOTP(): string {
    return randomBytes(3).toString("hex").toUpperCase();
  }

  private generateJWT(userId: string): string {
    return jwt.sign({ userId }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
  }

  async initiateLogin(email: string): Promise<ServiceResponse<null>> {
    try {
      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        // Create new user if they don't exist
        user = await prisma.user.create({
          data: {
            userId: randomUUID(),
            email,
            name: email.split("@")[0], // Use part before @ as temporary name
          },
        });
      }

      const otp = this.generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await prisma.user.update({
        where: { email },
        data: {
          otpSecret: otp,
          otpExpiry,
        },
      });

      await emailService.sendOTP(email, otp);

      return ServiceResponse.success("OTP sent successfully", null, StatusCodes.OK);
    } catch (error) {
      console.log("🚀 ~ AuthService ~ initiateLogin ~ error:", error);
      return ServiceResponse.failure("Failed to initiate login", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyOTP(email: string, otp: string): Promise<ServiceResponse<{ token: string }> | ServiceResponse<null>> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !user.otpSecret || !user.otpExpiry) {
        return ServiceResponse.failure("Invalid OTP request", null, StatusCodes.BAD_REQUEST);
      }

      if (new Date() > user.otpExpiry) {
        return ServiceResponse.failure("OTP has expired", null, StatusCodes.BAD_REQUEST);
      }

      if (user.otpSecret !== otp) {
        return ServiceResponse.failure("Invalid OTP", null, StatusCodes.BAD_REQUEST);
      }

      const token = this.generateJWT(user.userId);

      await prisma.user.update({
        where: { email },
        data: {
          otpSecret: null,
          otpExpiry: null,
          isVerified: true,
        },
      });

      return ServiceResponse.success("Login successful", { token }, StatusCodes.OK);
    } catch (error) {
      return ServiceResponse.failure("Failed to verify OTP", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const authService = new AuthService();
