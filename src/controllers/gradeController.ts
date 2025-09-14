import { AppError } from "../middlewares/errorHandler";
import type { Request, Response, NextFunction } from "express";
import {
  getGradesModel,
  getGradeByEnrollmentIdModel,
  createGradeModel,
  updateGradeModel,
  deleteGradeModel,
} from "../models/gradeModel";
import { sendValidationError } from "../utils/validate";
import { AssignGradeSchema, UpdateGradeSchema } from "../schemas/grade";

// Get all grades
export const getGradesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const grades = await getGradesModel();
    if (!grades || grades.length === 0) {
      const err = new Error("No grades found");
      (err as AppError).status = 404;
      throw err;
    }
    res.status(200).json(grades);
  } catch (error) {
    next(error);
  }
};

// Get grade by enrollment ID
export const getGradeByEnrollmentIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { enrollmentId } = req.params;
    const numericId = Number(enrollmentId);

    if (isNaN(numericId) || numericId <= 0) {
      const err = new Error("Invalid enrollment ID");
      (err as AppError).status = 400;
      throw err;
    }

    const grade = await getGradeByEnrollmentIdModel(numericId);
    if (!grade) {
      const err = new Error("Grade not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json(grade);
  } catch (error) {
    next(error);
  }
};

// Create new grade
export const createGradeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = AssignGradeSchema.safeParse(req.body);
    if (!validated.success) return sendValidationError(res, validated.error);

    const newGrade = await createGradeModel(validated.data);
    res.status(201).json(newGrade);
  } catch (error) {
    next(error);
  }
};

// Update existing grade by enrollment ID
export const updateGradeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { enrollmentId } = req.params;
    const numericId = Number(enrollmentId);

    if (isNaN(numericId) || numericId <= 0) {
      const err = new Error("Invalid enrollment ID");
      (err as AppError).status = 400;
      throw err;
    }

    const validated = UpdateGradeSchema.safeParse(req.body);
    if (!validated.success) return sendValidationError(res, validated.error);

    const updatedGrade = await updateGradeModel(numericId, validated.data);
    if (!updatedGrade) {
      const err = new Error("Grade not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json(updatedGrade);
  } catch (error) {
    next(error);
  }
};

// Delete grade by enrollment ID
export const deleteGradeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { enrollmentId } = req.params;
    const numericId = Number(enrollmentId);

    if (isNaN(numericId) || numericId <= 0) {
      const err = new Error("Invalid enrollment ID");
      (err as AppError).status = 400;
      throw err;
    }

    const deletedGrade = await deleteGradeModel(numericId);
    if (!deletedGrade) {
      const err = new Error("Grade not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json({ message: "Grade deleted successfully" });
  } catch (error) {
    next(error);
  }
};
