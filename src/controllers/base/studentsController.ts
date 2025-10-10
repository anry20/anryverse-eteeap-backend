import type { Request, Response, NextFunction } from "express";
import {
  getStudentsModel,
  getStudentByIdModel,
  createStudentModel,
  deleteStudentModel,
  updateStudentModel,
  getStudentByUserIdModel,
  updateMyStudentInfoModel,
} from "../../models/base/studentsModel";
import { AppError } from "../../middlewares/errorHandler";
import bcrypt from "bcrypt";
import {
  CreateStudentSchema,
  UpdateStudentSchema,
  UpdateMyStudentInfoSchema,
} from "../../schemas/base/student";
import { sendValidationError } from "../../utils/validate";

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
    const numericId = parseInt(id);

    if (isNaN(numericId) || numericId <= 0) {
      const err = new Error("Invalid ID format");
      (err as AppError).status = 400;
      throw err;
    }

    const student = await getStudentByIdModel(numericId);

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

// Create new student
export const createStudentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = CreateStudentSchema.safeParse(req.body);
    if (!validated.success) return sendValidationError(res, validated.error);

    const data = validated.data;

    // Hash the password before storing
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

// Update student
export const updateStudentController = async (
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

    const validated = UpdateStudentSchema.safeParse(req.body);
    if (!validated.success) return sendValidationError(res, validated.error);

    const updatedStudent = await updateStudentModel(numericId, validated.data);

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
    const numericId = parseInt(id);

    if (isNaN(numericId) || numericId <= 0) {
      const err = new Error("Invalid ID format");
      (err as AppError).status = 400;
      throw err;
    }

    const deletedUser = await deleteStudentModel(numericId);

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

// STUDENT USER CONTROLLERS
export const getMyStudentInfoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = req.session?.userId;
    if (!studentId) {
      const err = new Error("Unauthorized");
      (err as AppError).status = 401;
      throw err;
    }
    const student = await getStudentByUserIdModel(parseInt(studentId));
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

export const updateMyStudentInfoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.session!.userId;

    const numericId = parseInt(userId);

    if (isNaN(numericId) || numericId <= 0) {
      const err = new Error("Invalid ID format");
      (err as AppError).status = 400;
      throw err;
    }

    const validated = UpdateMyStudentInfoSchema.safeParse(req.body);
    if (!validated.success) return sendValidationError(res, validated.error);

    const updatedStudent = await updateMyStudentInfoModel(
      numericId,
      validated.data
    );

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
