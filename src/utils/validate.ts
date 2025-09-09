import { Response } from "express";
import { ZodError } from "zod";

export function sendValidationError(res: Response, error: ZodError) {
  return res.status(400).json({
    message: "Validation Failed",
    errors: error.issues.map((issue) => ({
      field: issue.path.length > 0 ? issue.path.join(".") : "global",
      message: issue.message,
    })),
  });
}

export const isUUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
