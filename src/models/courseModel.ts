import prisma from "../utils/db";

export interface CourseInput {
  courseName: string;
  description?: string;
}

export const getAllCoursesModel = async () => {
  return prisma.course.findMany({ orderBy: { createdAt: "desc" } });
};

export const getCourseByIdModel = async (id: string) => {
  return prisma.course.findUnique({ where: { courseId: id } });
};

export const createCourseModel = async (data: CourseInput) => {
  return prisma.course.create({ data });
};

export const updateCourseModel = async (id: string, data: CourseInput) => {
  return prisma.course.update({ where: { courseId: id }, data });
};

export const deleteCourseModel = async (id: string) => {
  return prisma.course.delete({ where: { courseId: id } });
};
