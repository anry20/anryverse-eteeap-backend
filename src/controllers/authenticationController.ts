import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { AppError } from "../middlewares/errorHandler";
import { LoginSchema } from "../schemas/authenticationSchema";
import { sendValidationError } from "../utils/validate";
import {
  getSessionDetailsModel,
  loginModel,
  sessionCheckModel,
} from "../models/authenticationModel";
import { createSession, deleteSession } from "../utils/session";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = LoginSchema.safeParse(req.body);
    if (!validated.success) {
      return sendValidationError(res, validated.error);
    }

    const { credential, password } = validated.data;

    const user = await loginModel(credential);
    if (!user) {
      const err = new Error("Invalid Username/Email or Password");
      (err as AppError).status = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("Invalid Username/Email or Password");
      (err as AppError).status = 401;
      throw err;
    }

    const payload = await createSession(res, {
      userId: user.userId.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    });

    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};

export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    deleteSession(res);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function getSessionDetailsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.session!.userId;

    if (!userId) {
      const err = new Error("Session not found");
      (err as AppError).status = 404;
      throw err;
    }

    const sessionDetails = await getSessionDetailsModel(parseInt(userId));
    res.status(200).json(sessionDetails);
  } catch (error) {
    next(error);
  }
}

export async function checkSessionController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.session?.userId;

    if (!userId) {
      return res.status(200).json({ role: "public" });
    }

    const sessionCheck = await sessionCheckModel(parseInt(userId));
    res.status(200).json(sessionCheck);
  } catch (error) {
    next(error);
  }
}
