// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { decryptSession } from "../utils/session";
import { AppError } from "./errorHandler";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies?.session;
    if (!token) {
      const err = new Error("Authentication required");
      (err as AppError).status = 401;
      throw err;
    }

    const session = await decryptSession(token);
    if (!session) {
      const err = new Error("Invalid or expired session");
      (err as AppError).status = 401;
      throw err;
    }

    // Attach session data to req
    (req as any).session = session;
    next();
  } catch (err) {
    next(err);
  }
}

export async function preventLoginForAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies?.session;
    if (token) {
      const session = await decryptSession(token);
      if (session) {
        const err = new Error("Already authenticated");
        (err as AppError).status = 403;
        throw err;
      }
    }
    next();
  } catch (err) {
    next(err);
  }
}
