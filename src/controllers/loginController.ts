import type { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/errorHandler";
import bcrypt from "bcrypt";
import { LoginSchema } from "../schemas/login";
import { sendValidationError } from "../utils/validate";
import { loginModel } from "../models/loginModel";
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

    // find user by email/username only
    const user = await loginModel(credential);

    if (!user) {
      const err = new Error("Invalid Username/Email or Password");
      (err as AppError).status = 401;
      throw err;
    }

    // compare plain password with hashed one
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("Invalid Username/Email or Password");
      (err as AppError).status = 401;
      throw err;
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    next(error);
  }
};
