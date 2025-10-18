import { Request } from "express";
import { AppError } from "../middlewares/errorHandler";

export function verifyAuth(req: Request): number {
  const userId = req.session?.userId;
  if (!userId) {
    const err = new Error("Unauthorized: Please log in");
    (err as AppError).status = 401;
    throw err;
  }
  return parseInt(userId);
}
