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
  getAllTermsModel,
  createTermModel,
  deleteTermModel,
  activateTermModel,
  getAllAdminModel,
  createAdminModel,
  getAdminDetailsModel,
  updateAdminModel,
  deleteAdminModel,
} from "../models/adminApiModel";
import {
  CreateFacultySchema,
  CreateSubjectSchema,
  CreateTermSchema,
  UpdateFacultySchema,
  UpdateSubjectSchema,
  CreateAdminSchema,
  UpdateAdminSchema,
  UpdateStudentSchema,
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
    const validated = UpdateStudentSchema.safeParse(studentData);

    if (!validated.success) {
      return sendValidationError(res, validated.error);
    }

    if (validated.data.password) {
      validated.data.password = await hashedPassword(validated.data.password);
    }

    const updatedStudent = await updateStudentModel(studentId, validated.data);
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
    const validated = CreateFacultySchema.safeParse(req.body);

    if (!validated.success) {
      return sendValidationError(res, validated.error);
    }

    const data = validated.data;

    const passwordHash = await hashedPassword(data.password);

    const newFaculty = await createFacultyModel({
      ...data,
      password: passwordHash,
    });

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
    const { id } = req.params;
    const numericId = parseInt(id);

    if (isNaN(numericId) || numericId <= 0) {
      const err = new Error("Invalid ID format");
      (err as AppError).status = 400;
      throw err;
    }

    const validated = UpdateFacultySchema.safeParse(req.body);
    if (!validated.success) return sendValidationError(res, validated.error);

    if (validated.data.password) {
      validated.data.password = await hashedPassword(validated.data.password);
    }

    const updatedFaculty = await updateFacultyModel(numericId, validated.data);

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

//Admin Management Controller
export const getAllAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const admins = await getAllAdminModel();
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

export const getAdminDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { adminId } = req.params;
    const numericAdminId = parseInt(adminId);
    if (isNaN(numericAdminId) || numericAdminId <= 0) {
      const err = new Error("Invalid ID format");
      (err as AppError).status = 400;
      throw err;
    }
    const admin = await getAdminDetailsModel(numericAdminId);
    res.status(200).json(admin);
  } catch (error) {
    next(error);
  }
};

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

    const passwordHash = await hashedPassword(data.password);

    const newAdmin = await createAdminModel({
      ...data,
      password: passwordHash,
    });

    res.status(201).json(newAdmin);
  } catch (err) {
    next(err);
  }
};

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

    res
      .status(200)
      .json({ message: "Admin deleted successfully" + deletedAdmin.username });
  } catch (error) {
    next(error);
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

//Term Management Controller
export const getAllTermsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const terms = await getAllTermsModel();
    if (!terms || terms.length === 0) {
      const err = new Error("No terms found");
      (err as AppError).status = 404;
      throw err;
    }
    res.status(200).json(terms);
  } catch (error) {
    next(error);
  }
};

export const createTermController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = CreateTermSchema.safeParse(req.body);
    if (!validated.success) return sendValidationError(res, validated.error);

    const newSubject = await createTermModel(validated.data);
    res.status(201).json(newSubject);
  } catch (error) {
    next(error);
  }
};

export const deleteTermController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      const err = new Error("ID is required");
      (err as AppError).status = 400;
      throw err;
    }

    const numericId = parseInt(id);

    if (isNaN(numericId) || numericId <= 0) {
      const err = new Error("Invalid ID format");
      (err as AppError).status = 400;
      throw err;
    }

    const deletedTerm = await deleteTermModel(numericId);
    if (!deletedTerm) {
      const err = new Error("Term not found");
      (err as AppError).status = 404;
      throw err;
    }

    res.status(200).json({ message: "Term deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const activateTermController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { termId } = req.params;
    const numericTermId = parseInt(termId);

    if (isNaN(numericTermId) || numericTermId <= 0) {
      const err = new Error("Invalid ID format");
      (err as AppError).status = 400;
      throw err;
    }
    const activatedTerm = await activateTermModel(numericTermId);
    res.status(200).json(activatedTerm);
  } catch (error) {
    next(error);
  }
};
