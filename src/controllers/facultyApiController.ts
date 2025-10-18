import type { Request, Response, NextFunction } from "express";
import {
  getClassListModel,
  getClassListBySubjectModel,
  addStudentGradeModel,
  getClassListStudentProfileModel,
  getSubjectTaughtModel,
  getFacultyProfileByIdModel,
  updateMyFacultyProfileModel,
} from "../models/facultyApiModel";
import { verifyAuth } from "../utils/verifyAuth";
import { AppError } from "../middlewares/errorHandler";
import { sendValidationError } from "../utils/validate";
import {
  UpdateMyFacultyProfileSchema,
  UpdateGradeSchema,
} from "../schemas/facultyApiSchemas";

export async function getClassListController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = verifyAuth(req);
    const classlist = await getClassListModel(userId);

    if (classlist.length === 0) {
      const err = new Error("No students found");
      (err as AppError).status = 404;
      throw err;
    }

    res.json(classlist);
  } catch (error) {
    next(error);
  }
}

export async function getClassListBySubjectController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = verifyAuth(req);
    const { subjectCode } = req.params;

    const classlist = await getClassListBySubjectModel(userId, subjectCode);

    if (classlist.length === 0) {
      const err = new Error("No students found for the specified subject");
      (err as AppError).status = 404;
      throw err;
    }

    res.json(classlist);
  } catch (error) {
    next(error);
  }
}

export async function getClassListStudentProfileController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = verifyAuth(req);
    const { studentId } = req.params;

    console.log("Received studentId:", studentId);

    if (!studentId || studentId.length === 0) {
      const err = new Error("Student ID is required");
      (err as AppError).status = 400;
      throw err;
    }

    const parsedStudentId = parseInt(studentId);

    if (isNaN(parsedStudentId)) {
      const err = new Error("Invalid ID format");
      (err as AppError).status = 400;
      throw err;
    }

    // Call the model function to get the student profile
    const student = await getClassListStudentProfileModel(
      userId,
      parsedStudentId
    );

    if (!student) {
      const err = new Error("Student does not exist or is not admitted");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
}

export async function addStudentGradeController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = verifyAuth(req);
    const { enrollmentId } = req.params;
    const { grade } = req.body;

    // Validate enrollmentId
    const parsedEnrollmentId = parseInt(enrollmentId);
    if (isNaN(parsedEnrollmentId)) {
      const err = new Error("Invalid ID format");
      (err as AppError).status = 400;
      throw err;
    }

    // Validate grade
    const parsedGrade = UpdateGradeSchema.safeParse({ grade });
    if (!parsedGrade.success) {
      sendValidationError(res, parsedGrade.error);
      return;
    }

    const updatedGrade = await addStudentGradeModel(
      parsedEnrollmentId,
      parsedGrade.data.grade,
      userId
    );

    res.json(updatedGrade);
  } catch (error) {
    next(error);
  }
}

export async function getSubjectsTaughtController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = verifyAuth(req);
    const subjects = await getSubjectTaughtModel(userId);

    if (subjects.length === 0) {
      const err = new Error("No subjects found");
      (err as AppError).status = 404;
      throw err;
    }

    res.json(subjects);
  } catch (error) {
    next(error);
  }
}

export const getMyFacultyInfoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = verifyAuth(req);
    if (!userId) {
      const err = new Error("Unauthorized");
      (err as AppError).status = 401;
      throw err;
    }
    const faculty = await getFacultyProfileByIdModel(userId);
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

export const updateMyFacultyProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = verifyAuth(req);

    const validated = UpdateMyFacultyProfileSchema.safeParse(req.body);
    if (!validated.success) return sendValidationError(res, validated.error);

    const updatedFaculty = await updateMyFacultyProfileModel(
      userId,
      validated.data
    );

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
