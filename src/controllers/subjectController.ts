import { AppError } from "../middlewares/errorHandler";
import type { Request, Response, NextFunction } from "express";
import {
  getSubjectsModel,
  getSubjectByIdModel,
  createSubjectModel,
  updateSubjectModel,
  deleteSubjectModel,
} from "../models/subjectModel";
import { isUUID, sendValidationError } from "../utils/validate";
import { CreateSubjectSchema, UpdateSubjectSchema } from "../schemas/subject";

export const getSubjectsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Subjects = await getSubjectsModel();
    if (!Subjects || Subjects.length === 0) {
      const err = new Error("No Subjects found");
      (err as AppError).status = 404;
      throw err;
    }
    res.status(200).json(Subjects);
  } catch (error) {
    next(error);
  }
};

export const getSubjectByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!isUUID.test(id)) {
      const err = new Error("Invalid ID format");
      (err as AppError).status = 400;
      throw err;
    }

    const Subject = await getSubjectByIdModel(id);
    if (!Subject) {
      const err = new Error("Subject not found");
      (err as AppError).status = 404;
      throw err;
    }
    res.status(200).json(Subject);
  } catch (error) {
    next(error);
  }
};

export const createSubjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = CreateSubjectSchema.safeParse(req.body);

    if (!validated.success) {
      return sendValidationError(res, validated.error);
    }

    const data = validated.data;

    const newSubject = await createSubjectModel(data);
    res.status(201).json(newSubject);
  } catch (error) {
    next(error);
  }
};

export const updateSubjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!isUUID.test(id)) {
      const err = new Error("Invalid ID format");
      (err as AppError).status = 400;
      throw err;
    }
    const validated = UpdateSubjectSchema.safeParse(req.body);
    if (!validated.success) {
      return sendValidationError(res, validated.error);
    }
    const data = validated.data;

    const updatedSubject = await updateSubjectModel(id, data);
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

export const deleteSubjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!isUUID.test(id)) {
      const err = new Error("Invalid ID format");
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
