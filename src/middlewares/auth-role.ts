import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

export function requireRoleMiddleware(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const session = (req as any).session;

    if (!session) {
      const err = new Error("Authentication required");
      (err as AppError).status = 401;
      return next(err);
    }

    if (!allowedRoles.includes(session.role)) {
      const err = new Error("Forbidden: insufficient role");
      (err as AppError).status = 403;
      return next(err);
    }

    next();
  };
}
