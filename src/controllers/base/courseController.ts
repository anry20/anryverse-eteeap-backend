import { AppError } from "../../middlewares/errorHandler";
import type { Request, Response, NextFunction } from "express";
import {
  getCoursesModel,
  getCourseByIdModel,
  createCourseModel,
  updateCourseModel,
  deleteCourseModel,
} from "../../models/base/courseModel";
import { sendValidationError } from "../../utils/validate";
import {
  CreateCourseSchema,
  UpdateCourseSchema,
} from "../../schemas/base/course";

// Get all courses
export const getCoursesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await getCoursesModel();
    if (!courses || courses.length === 0) {
      const err = new Error("No courses found");
      (err as AppError).status = 404;
      throw err;
    }
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};

// Get course by ID
export const getCourseByIdController = async (
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

    const course = await getCourseByIdModel(numericId);
    if (!course) {
      const err = new Error("Course not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

// Create new course
export const createCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = CreateCourseSchema.safeParse(req.body);

    if (!validated.success) {
      return sendValidationError(res, validated.error);
    }

    const data = validated.data;

    const newCourse = await createCourseModel(data);
    res.status(201).json(newCourse);
  } catch (error) {
    next(error);
  }
};

// Update course
export const updateCourseController = async (
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

    const validated = UpdateCourseSchema.safeParse(req.body);
    if (!validated.success) return sendValidationError(res, validated.error);

    const data = validated.data;

    const updatedCourse = await updateCourseModel(numericId, data);
    if (!updatedCourse) {
      const err = new Error("Course not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

// Delete course
export const deleteCourseController = async (
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

    const deletedCourse = await deleteCourseModel(numericId);
    if (!deletedCourse) {
      const err = new Error("Course not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    next(error);
  }
};
