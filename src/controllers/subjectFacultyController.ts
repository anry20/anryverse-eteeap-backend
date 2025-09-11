import { AppError } from "../middlewares/errorHandler";
import type { Request, Response, NextFunction } from "express";
import {
  assignFacultyToSubjectModel,
  getFacultyAssignmentsByFacultyIdModel,
  getFacultyForSubjectModel,
  removeFacultyFromSubjectModel,
} from "../models/subjectFacultyModel";
import { sendValidationError } from "../utils/validate";

import { assignFacultyToSubjectSchema } from "../schemas/subjectFaculty";

export const assignFacultyToSubjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const validation = assignFacultyToSubjectSchema.safeParse(req.body);
    if (!validation.success) {
      return sendValidationError(res, validation.error);
    }
    const assignedFaculty = await assignFacultyToSubjectModel(
      id,
      validation.data.facultyId
    );

    if (!assignedFaculty) {
      const err = new Error("Assignment failed");
      (err as AppError).status = 400;
      throw err;
    }

    return res.status(201).json(assignedFaculty);
  } catch (error) {
    next(error);
  }
};

export const removeFacultyFromSubjectController = async (
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

    const removedAssignment = await removeFacultyFromSubjectModel(numericId);
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

export const getFacultyForSubjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const subjectCode = req.params.id;
    if (!subjectCode) {
      const err = new Error("Subject code is required");
      (err as AppError).status = 400;
      throw err;
    }

    const faculties = await getFacultyForSubjectModel(subjectCode);

    if (!faculties || faculties.length === 0) {
      const err = new Error("No faculty assigned to this subject");
      (err as AppError).status = 404;
      throw err;
    }

    return res.status(200).json(faculties);
  } catch (error) {
    next(error);
  }
};

export const getFacultyAssignmentsByFacultyIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const facultyId = parseInt(req.params.id);
    if (isNaN(facultyId) || facultyId <= 0) {
      const err = new Error("Invalid faculty ID");
      (err as AppError).status = 400;
      throw err;
    }

    const assignments = await getFacultyAssignmentsByFacultyIdModel(facultyId);

    if (!assignments || assignments.length === 0) {
      const err = new Error("No assignments found for this faculty");
      (err as AppError).status = 404;
      throw err;
    }

    return res.status(200).json(assignments);
  } catch (error) {
    next(error);
  }
};
