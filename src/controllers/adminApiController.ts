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
  getAllFacultiesModel,
  getFacultyDetailsModel,
  createFacultyModel,
  updateFacultyModel,
  deleteFacultyModel,
  assignFacultyToSubjectModel,
  unAssignFacultyFromSubjectModel,
} from "../models/adminApiModel";
import {
  CreateFacultySchema,
  CreateSubjectSchema,
  UpdateFacultySchema,
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

// Faculty Management Controller

export const getAllFacultiesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const faculty = await getAllFacultiesModel();
    if (!faculty) {
      const err = new Error("No faculty found");
      (err as AppError).status = 404;
      throw err;
    }
    res.status(200).json(faculty);
  } catch (err) {
    next(err);
  }
};

export const getFacultyDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const facultyId = parseInt(req.params.facultyId);
    const faculty = await getFacultyDetailsModel(facultyId);
    if (!faculty) {
      const err = new Error("Faculty not found");
      (err as AppError).status = 404;
      throw err;
    }
    res.status(200).json(faculty);
  } catch (err) {
    next(err);
  }
};

export const createFacultyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const facultyData = CreateFacultySchema.safeParse(req.body);

    if (!facultyData.success)
      return sendValidationError(res, facultyData.error);

    const newFaculty = await createFacultyModel(facultyData.data);

    if (!newFaculty) {
      const err = new Error("Failed to create faculty");
      (err as AppError).status = 500;
      throw err;
    }

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
    const facultyId = parseInt(req.params.facultyId);
    const facultyData = UpdateFacultySchema.safeParse(req.body);

    if (!facultyData.success)
      return sendValidationError(res, facultyData.error);
    const updatedFaculty = await updateFacultyModel(
      facultyId,
      facultyData.data
    );

    res.status(200).json(updatedFaculty);
  } catch (err) {
    next(err);
  }
};

export const deleteFacultyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const facultyId = parseInt(req.params.facultyId);
    await deleteFacultyModel(facultyId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

//Faculty Subject Assignment Controller
export const assignFacultyToSubjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { subjectCode, facultyId } = req.body;
    const assignment = await assignFacultyToSubjectModel(
      subjectCode,
      facultyId
    );
    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
};

export const unAssignFacultyFromSubjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { subjectFacultyId } = req.params;
    const numericId = parseInt(subjectFacultyId);

    if (isNaN(numericId) || numericId <= 0) {
      const err = new Error("Invalid ID format");
      (err as AppError).status = 400;
      throw err;
    }

    const removedAssignment = await unAssignFacultyFromSubjectModel(numericId);

    if (!removedAssignment) {
      const err = new Error("No assignment found to remove");
      (err as AppError).status = 404;
      throw err;
    }

    return res.status(200).json(removedAssignment);
  } catch (error) {
    next(error);
  }
};
