import prisma from "../utils/db";
import { CreateCourseSchema, UpdateCourseSchema } from "../schemas/course";

export const getAllCoursesModel = async () => {
  return await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getCourseByIdModel = async (id: string) => {
  return await prisma.course.findUnique({ where: { courseId: id } });
};

export const createCourseModel = async (data: CreateCourseSchema) => {
  return prisma.course.create({ data });
};

export const updateCourseModel = async (
  id: string,
  data: UpdateCourseSchema
) => {
  return prisma.course.update({ where: { courseId: id }, data });
};

export const deleteCourseModel = async (id: string) => {
  return prisma.course.delete({ where: { courseId: id } });
};
