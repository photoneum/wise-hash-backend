import type { Request, RequestHandler, Response } from "express";

import { authService } from "@/api/authentication/authService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { logger } from "@/server";

class AuthController {
  public login: RequestHandler = async (_req: Request, res: Response) => {
    const email = _req.body.email;
    const serviceResponse = await authService.initiateLogin(email);
    return handleServiceResponse(serviceResponse, res);
  };

  public verifyOTP: RequestHandler = async (req: Request, res: Response) => {
    const email = req.body.email;
    const otp = req.body.otp;
    const serviceResponse = await authService.verifyOTP(email, otp);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const authController = new AuthController();
