import type { Request, Response, NextFunction } from "express";
import {
  getAllStudentsModel,
  getStudentByIdModel,
  enrollStudentModel,
  deleteStudentModel,
} from "../models/studentsModel";
import { AppError } from "../middlewares/errorHandler";
import bcrypt from "bcrypt";
import { studentSchema } from "../schemas/enrollment";

// Get all students
export const getAllStudentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const students = await getAllStudentsModel();
    res.status(200).json(students);
  } catch (error) {
    next(error);
  }
};

// Get student by ID
export const getStudentByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const student = await getStudentByIdModel(id);

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

// Enroll new student
export const enrollStudentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate request body
    const { error, value } = studentSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      // Return all validation errors
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((d) => ({
          field: d.path.join("."),
          message: d.message,
        })),
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(value.password, 10);

    // Enroll student
    await enrollStudentModel({
      ...value,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Student enrolled successfully" });
  } catch (err) {
    next(err);
  }
};

// Delete student
export const deleteStudentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteStudentModel(id);

    if (!deletedUser) {
      const err = new Error("Student not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    next(error);
  }
};
