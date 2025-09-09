// models/student.model.ts
import prisma from "../utils/db";
import type {
  CreateFacultySchema,
  UpdateFacultySchema,
} from "../schemas/faculty";

export const getFacultiesModel = async () => {
  return prisma.faculty.findMany({ orderBy: { createdAt: "desc" } });
};

export const getFacultyByIdModel = async (id: number) => {
  return prisma.faculty.findUnique({ where: { facultyId: id } });
};

export const createFacultyModel = async (data: CreateFacultySchema) => {
  const user = await prisma.user.create({
    data: {
      username: data.username,
      password: data.password,
      email: data.email,
      role: "faculty",
    },
  });

  const faculty = await prisma.faculty.create({
    data: {
      userId: user.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      contactNo: data.contactNo,
    },
    include: {
      user: true,
    },
  });

  return faculty;
};

export const updateFacultyModel = async (
  facultyId: number,
  data: UpdateFacultySchema
) => {
  const existingFaculty = await prisma.faculty.findUnique({
    where: { facultyId },
  });

  if (!existingFaculty) {
    return null; // let the controller handle the 404
  }

  const faculty = await prisma.faculty.update({
    where: { facultyId },
    data,
    include: {
      user: true,
    },
  });

  return faculty;
};

export const deleteFacultyModel = async (facultyId: number) => {
  const faculty = await prisma.faculty.findUnique({
    where: { facultyId },
    select: { userId: true },
  });

  if (!faculty) return null;

  return prisma.user.delete({
    where: { userId: faculty.userId },
  });
};
