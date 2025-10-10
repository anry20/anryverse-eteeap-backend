import prisma from "../../utils/db";
import { AssignGradeSchema, UpdateGradeSchema } from "../../schemas/base/grade";

export const getGradesModel = async () => {
  return prisma.grade.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getGradeByEnrollmentIdModel = async (enrollmentId: number) => {
  return prisma.grade.findUnique({
    where: { enrollmentId },
  });
};

export const createGradeModel = async (data: AssignGradeSchema) => {
  return prisma.grade.create({
    data,
  });
};

export const updateGradeModel = async (
  enrollmentId: number,
  data: UpdateGradeSchema
) => {
  const existingGrade = await prisma.grade.findUnique({
    where: { enrollmentId },
  });

  if (!existingGrade) {
    return null;
  }

  return prisma.grade.update({
    where: { enrollmentId },
    data,
  });
};

export const deleteGradeModel = async (enrollmentId: number) => {
  const existingGrade = await prisma.grade.findUnique({
    where: { enrollmentId },
  });

  if (!existingGrade) {
    return null;
  }

  return prisma.grade.delete({
    where: { enrollmentId },
  });
};
