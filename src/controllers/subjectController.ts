import { AppError } from "../middlewares/errorHandler";
import type { Request, Response, NextFunction } from "express";
import {
  getSubjectsModel,
  getSubjectByIdModel,
  createSubjectModel,
  updateSubjectModel,
  deleteSubjectModel,
} from "../models/subjectModel";
import { sendValidationError } from "../utils/validate";
import { CreateSubjectSchema, UpdateSubjectSchema } from "../schemas/subject";

// Get all subjects
export const getSubjectsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const subjects = await getSubjectsModel();
    if (!subjects || subjects.length === 0) {
      const err = new Error("No subjects found");
      (err as AppError).status = 404;
      throw err;
    }
    res.status(200).json(subjects);
  } catch (error) {
    next(error);
  }
};

// Get subject by ID
export const getSubjectByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      const err = new Error("ID is required");
      (err as AppError).status = 400;
      throw err;
    }

    const subject = await getSubjectByIdModel(id);
    if (!subject) {
      const err = new Error("Subject not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json(subject);
  } catch (error) {
    next(error);
  }
};

// Create new subject
export const createSubjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = CreateSubjectSchema.safeParse(req.body);
    if (!validated.success) return sendValidationError(res, validated.error);

    const newSubject = await createSubjectModel(validated.data);
    res.status(201).json(newSubject);
  } catch (error) {
    next(error);
  }
};

// Update subject
export const updateSubjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      const err = new Error("ID is required");
      (err as AppError).status = 400;
      throw err;
    }

    const validated = UpdateSubjectSchema.safeParse(req.body);
    if (!validated.success) return sendValidationError(res, validated.error);

    const updatedSubject = await updateSubjectModel(id, validated.data);

    if (!updatedSubject) {
      const err = new Error("Subject not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json(updatedSubject);
  } catch (error) {
    next(error);
  }
};

// Delete subject
export const deleteSubjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      const err = new Error("ID is required");
      (err as AppError).status = 400;
      throw err;
    }

    const deletedSubject = await deleteSubjectModel(id);
    if (!deletedSubject) {
      const err = new Error("Subject not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    next(error);
  }
};
