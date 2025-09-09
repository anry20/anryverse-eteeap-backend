import type { Request, Response, NextFunction } from "express";
import {
  getFacultiesModel,
  getFacultyByIdModel,
  createFacultyModel,
  deleteFacultyModel,
  updateFacultyModel,
} from "../models/facultyModel";
import { AppError } from "../middlewares/errorHandler";
import bcrypt from "bcrypt";
import { CreateFacultySchema, UpdateFacultySchema } from "../schemas/faculty";
import { isUUID, sendValidationError } from "../utils/validate";

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

// Get student by ID
export const getFacultyByIdController = async (
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

    const student = await getFacultyByIdModel(id);

    if (!student) {
      const err = new Error("Faculty not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

// Enroll new student
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

export const updateFacultyController = async (
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

    const validated = UpdateFacultySchema.safeParse(req.body);

    if (!validated.success) {
      return sendValidationError(res, validated.error);
    }

    const data = validated.data;

    const updatedStudent = await updateFacultyModel(id, data);

    if (!updatedStudent) {
      const err = new Error("Faculty not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json(updatedStudent);
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

    if (!isUUID.test(id)) {
      const err = new Error("Invalid ID format");
      (err as AppError).status = 400;
      throw err;
    }

    const deletedUser = await deleteFacultyModel(id);

    if (!deletedUser) {
      const err = new Error("Faculty not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    next(error);
  }
};
