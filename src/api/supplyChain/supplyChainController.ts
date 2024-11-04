import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { supplyChainService } from "./supplyChainService";

class SupplyChainController {
  public createEvent: RequestHandler = async (req: Request, res: Response) => {
    const ownerId = req.user!.id;
    const serviceResponse = await supplyChainService.createEvent(req.body, ownerId);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const supplyChainController = new SupplyChainController();
