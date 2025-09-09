import { Request, Response, NextFunction } from "express";
import { RandomUUIDOptions } from "crypto"; //Linter Check

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(`Status ${err.status}: ${err.message}`);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};
