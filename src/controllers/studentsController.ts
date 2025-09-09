import type { Request, Response, NextFunction } from "express";
import {
  getAllStudentsModel,
  getStudentByIdModel,
  enrollStudentModel,
  deleteStudentModel,
} from "../models/studentsModel";
import { AppError } from "../middlewares/errorHandler";
import bcrypt from "bcrypt";
import { EnrollStudentSchema } from "../schemas/enrollment";
import { send } from "process";
import { sendValidationError } from "../utils/validate";

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
    const result = EnrollStudentSchema.safeParse(req.body);

    if (!result.success) {
      return sendValidationError(res, result.error);
    }

    const data = result.data;

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await enrollStudentModel({
      ...data,
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
