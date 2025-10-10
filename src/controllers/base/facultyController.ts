import type { Request, Response, NextFunction } from "express";
import {
  getFacultiesModel,
  getFacultyByIdModel,
  createFacultyModel,
  deleteFacultyModel,
  updateFacultyModel,
} from "../../models/base/facultyModel";
import { AppError } from "../../middlewares/errorHandler";
import bcrypt from "bcrypt";
import {
  CreateFacultySchema,
  UpdateFacultySchema,
} from "../../schemas/base/faculty";
import { sendValidationError } from "../../utils/validate";

// Get all faculties
export const getFacultiesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const faculties = await getFacultiesModel();
    if (!faculties || faculties.length === 0) {
      const err = new Error("No faculties found");
      (err as AppError).status = 404;
      throw err;
    }
    res.status(200).json(faculties);
  } catch (error) {
    next(error);
  }
};

// Get faculty by ID
export const getFacultyByIdController = async (
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

    const faculty = await getFacultyByIdModel(numericId);

    if (!faculty) {
      const err = new Error("Faculty not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json(faculty);
  } catch (error) {
    next(error);
  }
};

// Create new faculty
export const createFacultyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = CreateFacultySchema.safeParse(req.body);

    if (!validated.success) {
      return sendValidationError(res, validated.error);
    }

    const data = validated.data;

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newFaculty = await createFacultyModel({
      ...data,
      password: hashedPassword,
    });

    res.status(201).json(newFaculty);
  } catch (err) {
    next(err);
  }
};

// Update faculty
export const updateFacultyController = async (
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

    const validated = UpdateFacultySchema.safeParse(req.body);
    if (!validated.success) return sendValidationError(res, validated.error);

    const updatedFaculty = await updateFacultyModel(numericId, validated.data);

    if (!updatedFaculty) {
      const err = new Error("Faculty not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json(updatedFaculty);
  } catch (err) {
    next(err);
  }
};

// Delete faculty
export const deleteFacultyController = async (
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

    const deletedFaculty = await deleteFacultyModel(numericId);

    if (!deletedFaculty) {
      const err = new Error("Faculty not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// FACULTY USER CONTROLLER
export const getMyFacultyInfoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.session!.userId;
    if (!userId) {
      const err = new Error("Unauthorized");
      (err as AppError).status = 401;
      throw err;
    }
    const faculty = await getFacultyByIdModel(parseInt(userId));
    if (!faculty) {
      const err = new Error("Faculty not found");
      (err as AppError).status = 404;
      throw err;
    }
    res.status(200).json(faculty);
  } catch (error) {
    next(error);
  }
};
