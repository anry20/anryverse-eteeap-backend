import type { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/errorHandler";
import {
  getStudentByUserIdModel,
  getStudentEnrollmentsModel,
} from "../models/studentApiModel";
import { UpdateMyStudentProfileSchema } from "../schemas/studentApiSchemas";
import { sendValidationError } from "../utils/validate";
import { updateMyStudentInfoModel } from "../models/studentApiModel";

export const studentInfoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = req.session?.userId;
    if (!studentId) {
      const err = new Error("Unauthorized");
      (err as AppError).status = 401;
      throw err;
    }
    const student = await getStudentByUserIdModel(parseInt(studentId));
    if (!student) {
      const err = new Error("Student not found");
      (err as AppError).status = 404;
      throw err;
    }
    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

export const myEnrollmentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      const err = new Error("Unauthorized");
      (err as AppError).status = 401;
      throw err;
    }

    const enrollments = await getStudentEnrollmentsModel(parseInt(userId));
    if (!enrollments) {
      const err = new Error("Enrollments not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json(enrollments);
  } catch (error) {
    next(error);
  }
};

export const updateMyStudentInfoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.session!.userId;

    const numericId = parseInt(userId);

    if (isNaN(numericId) || numericId <= 0) {
      const err = new Error("Invalid ID format");
      (err as AppError).status = 400;
      throw err;
    }

    const validated = UpdateMyStudentProfileSchema.safeParse(req.body);
    if (!validated.success) return sendValidationError(res, validated.error);

    const updatedStudent = await updateMyStudentInfoModel(
      numericId,
      validated.data
    );

    if (!updatedStudent) {
      const err = new Error("Student not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json(updatedStudent);
  } catch (err) {
    next(err);
  }
};
