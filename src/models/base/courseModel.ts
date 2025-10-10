import prisma from "../../utils/db";
import {
  CreateCourseSchema,
  UpdateCourseSchema,
} from "../../schemas/base/course";

export const getCoursesModel = async () => {
  return await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getCourseByIdModel = async (id: number) => {
  return await prisma.course.findUnique({ where: { courseId: id } });
};

export const createCourseModel = async (data: CreateCourseSchema) => {
  return prisma.course.create({ data });
};

export const updateCourseModel = async (
  id: number,
  data: UpdateCourseSchema
) => {
  const existingCourse = await prisma.course.findUnique({
    where: { courseId: id },
  });

  if (!existingCourse) {
    return null;
  }

  return prisma.course.update({ where: { courseId: id }, data });
};

export const deleteCourseModel = async (id: number) => {
  return prisma.course.delete({ where: { courseId: id } });
};
