import { AppError } from "../middlewares/errorHandler";
import type { Request, Response, NextFunction } from "express";

export const getAllCoursesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({ message: "Get all courses - to be implemented" });
  } catch (error) {
    next(error);
  }
};
