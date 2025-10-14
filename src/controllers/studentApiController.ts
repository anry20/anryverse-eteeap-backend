import type { Request, Response, NextFunction } from "express";

export const getMyStudentInfoController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ message: "My student profile information" });
};
