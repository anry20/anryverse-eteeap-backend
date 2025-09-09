// models/student.model.ts
import prisma from "../utils/db";
import type {
  CreateFacultySchema,
  UpdateFacultySchema,
} from "../schemas/faculty";
import { CreateStudentSchema } from "../schemas/student";

export const getAllFacultiesModel = async () => {
  return prisma.faculty.findMany({ orderBy: { createdAt: "desc" } });
};

export const getFacultyByIdModel = async (id: string) => {
  return prisma.faculty.findUnique({ where: { facultyId: id } });
};

export const createStudentModel = async (data: CreateFacultySchema) => {
  const user = await prisma.user.create({
    data: {
      username: data.username,
      password: data.password,
      role: "faculty",
    },
  });

  const faculty = await prisma.faculty.create({
    data: {
      userId: user.userId,
      department: data.department,
      firstName: data.firstName,
      lastName: data.lastName,
    },
    include: {
      user: true,
    },
  });

  return faculty;
};

export const updateFacultyModel = async (
  facultyId: string,
  data: UpdateFacultySchema
) => {
  const faculty = await prisma.faculty.update({
    where: { facultyId },
    data,
    include: {
      user: true,
    },
  });

  return faculty;
};

export const deleteFacultyModel = async (facultyId: string) => {
  const faculty = await prisma.faculty.findUnique({
    where: { facultyId },
    select: { userId: true },
  });

  if (!faculty) return null;

  return prisma.user.delete({
    where: { userId: faculty.userId },
  });
};
