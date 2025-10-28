import { Request, Response, NextFunction } from "express";
import { sendValidationError } from "../utils/validate";
import { hashedPassword } from "../utils/hash";
import { AppError } from "../middlewares/errorHandler";
import {
  addSubjectModel,
  deleteStudentModel,
  deleteSubjectModel,
  getAllStudentsModel,
  getAllSubjectsModel,
  getStudentDetailsModel,
  updateSubjectModel,
  updateStudentModel,
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

    if (!subjects) {
      const err = new Error("No subjects found");
      (err as AppError).status = 404;
      throw err;
    }
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

// Student Management Controller
export const getAllStudentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const students = await getAllStudentsModel();
    if (!students) {
      const err = new Error("No students found");
      (err as AppError).status = 404;
      throw err;
    }
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
};

export const getStudentDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = parseInt(req.params.studentId);
    const student = await getStudentDetailsModel(studentId);

    if (!student) {
      const err = new Error("Student not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json(student);
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
    const studentId = parseInt(req.params.studentId);
    const studentData = req.body;
    const updatedStudent = await updateStudentModel(studentId, studentData);
    res.status(200).json(updatedStudent);
  } catch (err) {
    next(err);
  }
};

export const deleteStudentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = parseInt(req.params.studentId);
    await deleteStudentModel(studentId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
