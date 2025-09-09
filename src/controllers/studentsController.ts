import type { Request, Response, NextFunction } from "express";
import {
  getStudentsModel,
  getStudentByIdModel,
  createStudentModel,
  deleteStudentModel,
  updateStudentModel,
} from "../models/studentsModel";
import { AppError } from "../middlewares/errorHandler";
import bcrypt from "bcrypt";
import { CreateStudentSchema, UpdateStudentSchema } from "../schemas/student";
import { isUUID, sendValidationError } from "../utils/validate";

// Get all students
export const getStudentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const students = await getStudentsModel();
    if (!students || students.length === 0) {
      const err = new Error("No students found");
      (err as AppError).status = 404;
      throw err;
    }
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

    if (!isUUID.test(id)) {
      const err = new Error("Invalid ID format");
      (err as AppError).status = 400;
      throw err;
    }

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
export const createStudentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = CreateStudentSchema.safeParse(req.body);

    if (!validated.success) {
      return sendValidationError(res, validated.error);
    }

    const data = validated.data;

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newStudent = await createStudentModel({
      ...data,
      password: hashedPassword,
    });

    res.status(201).json(newStudent);
  } catch (err) {
    next(err);
  }
};

export const updateStudentController = async (
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

    const validated = UpdateStudentSchema.safeParse(req.body);

    if (!validated.success) {
      return sendValidationError(res, validated.error);
    }

    const data = validated.data;

    const updatedStudent = await updateStudentModel(id, data);

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

// Delete student
export const deleteStudentController = async (
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
