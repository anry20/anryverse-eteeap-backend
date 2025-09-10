import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { AppError } from "../middlewares/errorHandler";
import { LoginSchema } from "../schemas/login";
import { sendValidationError } from "../utils/validate";
import { loginModel } from "../models/authenticationModel";
import { createSession } from "../utils/session";

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

    const { password: _, ...safeUser } = user;

    await createSession(res, {
      userId: user.userId.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({ message: "Login successful", user: safeUser });
  } catch (error) {
    next(error);
  }
};
