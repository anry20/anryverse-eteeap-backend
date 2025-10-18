import type { Request, Response, NextFunction } from "express";
import { CreateStudentSchema } from "../schemas/adminApiSchemas";
import { sendValidationError } from "../utils/validate";
import { hashedPassword } from "../utils/hash";
import { enrollStudentModel, getCoursesModel } from "../models/enrollmentModel";

export const enrollStudentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = CreateStudentSchema.safeParse(req.body);
    if (!validated.success) return sendValidationError(res, validated.error);

    const data = validated.data;

    // Hash the password before storing
    const password = await hashedPassword(data.password);

    const newStudent = await enrollStudentModel({
      ...data,
      password: password,
    });

    res.status(201).json({
      message: `Student ${newStudent.firstName} enrolled successfully, you may start using the portal after official admission.`,
    });
  } catch (err) {
    next(err);
  }
};

export const getCoursesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await getCoursesModel();
    res.status(200).json(courses);
  } catch (err) {
    next(err);
  }
};
