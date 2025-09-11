import type { Request, Response, NextFunction } from "express";
import {
  getAdminsModel,
  getAdminByIdModel,
  createAdminModel,
  updateAdminModel,
  deleteAdminModel,
} from "../models/adminModel";
import { AppError } from "../middlewares/errorHandler";
import bcrypt from "bcrypt";
import { CreateAdminSchema, UpdateAdminSchema } from "../schemas/admin";
import { sendValidationError } from "../utils/validate";

// Get all admins
export const getAdminsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const admins = await getAdminsModel();
    if (!admins || admins.length === 0) {
      const err = new Error("No admins found");
      (err as AppError).status = 404;
      throw err;
    }
    res.status(200).json(admins);
  } catch (error) {
    next(error);
  }
};

// Get admin by ID
export const getAdminByIdController = async (
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

    const admin = await getAdminByIdModel(numericId);

    if (!admin) {
      const err = new Error("Admin not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json(admin);
  } catch (error) {
    next(error);
  }
};

// Create new admin
export const createAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = CreateAdminSchema.safeParse(req.body);

    if (!validated.success) {
      return sendValidationError(res, validated.error);
    }

    const data = validated.data;

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newAdmin = await createAdminModel({
      ...data,
      password: hashedPassword,
    });

    res.status(201).json(newAdmin);
  } catch (err) {
    next(err);
  }
};

// Update admin
export const updateAdminController = async (
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

    const validated = UpdateAdminSchema.safeParse(req.body);
    if (!validated.success) return sendValidationError(res, validated.error);

    const updatedAdmin = await updateAdminModel(numericId, validated.data);

    if (!updatedAdmin) {
      const err = new Error("Admin not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json(updatedAdmin);
  } catch (err) {
    next(err);
  }
};

// Delete admin
export const deleteAdminController = async (
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

    const deletedAdmin = await deleteAdminModel(numericId);

    if (!deletedAdmin) {
      const err = new Error("Admin not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    next(error);
  }
};
