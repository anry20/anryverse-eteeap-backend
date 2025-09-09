import { AppError } from "../middlewares/errorHandler";
import type { Request, Response, NextFunction } from "express";
import {
  getAllCoursesModel,
  getCourseByIdModel,
  createCourseModel,
  updateCourseModel,
  deleteCourseModel,
} from "../models/courseModel";
import { isUUID, sendValidationError } from "../utils/validate";
import { CreateCourseSchema, UpdateCourseSchema } from "../schemas/course";

export const getAllCoursesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await getAllCoursesModel();
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

export const getCourseByIdController = async (
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

    const course = await getCourseByIdModel(id);
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

export const updateCourseController = async (
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
    const validated = UpdateCourseSchema.safeParse(req.body);
    if (!validated.success) {
      return sendValidationError(res, validated.error);
    }
    const data = validated.data;

    const updatedCourse = await updateCourseModel(id, data);
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

export const deleteCourseController = async (
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

    const deletedCourse = await deleteCourseModel(id);
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
