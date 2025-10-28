import { Request, Response, NextFunction } from "express";
import { sendValidationError } from "../utils/validate";
import { hashedPassword } from "../utils/hash";
import { AppError } from "../middlewares/errorHandler";
import {
  addSubjectModel,
  deleteSubjectModel,
  getAllSubjectsModel,
  updateSubjectModel,
} from "../models/adminApiModel";
import {
  CreateSubjectSchema,
  UpdateSubjectSchema,
} from "../schemas/adminApiSchemas";

// Subject Management Controller
export const getAllSubjectsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const subjects = await getAllSubjectsModel();

    res.status(200).json(subjects);
  } catch (err) {
    next(err);
  }
};

export const addSubjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const subjectData = CreateSubjectSchema.safeParse(req.body);

    if (!subjectData.success)
      return sendValidationError(res, subjectData.error);

    const newSubject = await addSubjectModel(subjectData.data);

    res.status(201).json(newSubject);
  } catch (err) {
    next(err);
  }
};

export const updateSubjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const subjectCode = req.params.subjectCode;
    const subjectData = UpdateSubjectSchema.safeParse(req.body);

    if (!subjectData.success)
      return sendValidationError(res, subjectData.error);

    const updatedSubject = await updateSubjectModel(
      subjectCode,
      subjectData.data
    );

    res.status(200).json(updatedSubject);
  } catch (err) {
    next(err);
  }
};

export const deleteSubjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const subjectCode = req.params.subjectCode;
    await deleteSubjectModel(subjectCode);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
