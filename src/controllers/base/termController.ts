import { AppError } from "../../middlewares/errorHandler";
import type { Request, Response, NextFunction } from "express";
import {
  getTermsModel,
  getTermByIdModel,
  createTermModel,
  updateTermModel,
  deleteTermModel,
} from "../../models/base/termModel";
import { sendValidationError } from "../../utils/validate";
import { CreateTermSchema, UpdateTermSchema } from "../../schemas/base/term";

// Get all term
export const getTermsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const terms = await getTermsModel();
    if (!terms || terms.length === 0) {
      const err = new Error("No terms found");
      (err as AppError).status = 404;
      throw err;
    }
    res.status(200).json(terms);
  } catch (error) {
    next(error);
  }
};

// Get term by ID
export const getTermByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const numericId = parseInt(id);

    if (isNaN(numericId) || numericId <= 0) {
      const err = new Error("Invalid ID format");
      (err as AppError).status = 400;
      throw err;
    }
    if (!id) {
      const err = new Error("ID is required");
      (err as AppError).status = 400;
      throw err;
    }

    const term = await getTermByIdModel(numericId);
    if (!term) {
      const err = new Error("Term not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json(term);
  } catch (error) {
    next(error);
  }
};

// Create new term
export const createTermController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = CreateTermSchema.safeParse(req.body);
    if (!validated.success) return sendValidationError(res, validated.error);

    const newSubject = await createTermModel(validated.data);
    res.status(201).json(newSubject);
  } catch (error) {
    next(error);
  }
};

// Update term
export const updateTermController = async (
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

    const numericId = parseInt(id);

    if (isNaN(numericId) || numericId <= 0) {
      const err = new Error("Invalid ID format");
      (err as AppError).status = 400;
      throw err;
    }

    const validated = UpdateTermSchema.safeParse(req.body);
    if (!validated.success) return sendValidationError(res, validated.error);

    const updatedTerm = await updateTermModel(numericId, validated.data);

    if (!updatedTerm) {
      const err = new Error("Term not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json(updatedTerm);
  } catch (error) {
    next(error);
  }
};

// Delete term
export const deleteTermController = async (
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

    const numericId = parseInt(id);

    if (isNaN(numericId) || numericId <= 0) {
      const err = new Error("Invalid ID format");
      (err as AppError).status = 400;
      throw err;
    }

    const deletedTerm = await deleteTermModel(numericId);
    if (!deletedTerm) {
      const err = new Error("Term not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json({ message: "Term deleted successfully" });
  } catch (error) {
    next(error);
  }
};
