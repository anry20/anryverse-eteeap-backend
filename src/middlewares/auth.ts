// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { decryptSession } from "../utils/session";
import { AppError } from "./errorHandler";

// Middleware to prevent access if already authenticated
export async function preventAuthenticatedAccess(
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

// Middleware to check authentication and role
export async function checkAuthAndRole(
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

    req.session = session;
    next();
  } catch (error) {
    next(error);
  }
}

export async function checkRoleAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.session) {
      const err = new Error("Authentication required");
      (err as AppError).status = 401;
      throw err;
    }
    if (req.session.role !== "admin") {
      const err = new Error("Insufficient permissions");
      (err as AppError).status = 403;
      throw err;
    }
    next();
  } catch (error) {
    next(error);
  }
}

export async function checkRoleStudent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.session) {
      const err = new Error("Authentication required");
      (err as AppError).status = 401;
      throw err;
    }
    if (req.session.role !== "student") {
      const err = new Error("Insufficient permissions");
      (err as AppError).status = 403;
      throw err;
    }
    next();
  } catch (error) {
    next(error);
  }
}

export async function checkRoleFaculty(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.session) {
      const err = new Error("Authentication required");
      (err as AppError).status = 401;
      throw err;
    }
    if (req.session.role !== "faculty") {
      const err = new Error("Insufficient permissions");
      (err as AppError).status = 403;
      throw err;
    }
    next();
  } catch (error) {
    next(error);
  }
}
