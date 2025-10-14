import type { Request, Response } from "express";

export const getMyStudentInfoController = (req: Request, res: Response) => {
  res.json({ message: "My student profile information" });
};
