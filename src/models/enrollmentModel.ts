import prisma from "../utils/db";

import {
  ChangeEnrollmentStatusSchema,
  EnrollmentSchema,
} from "../schemas/enrollment";

export const enrollStudentModel = async (enrollmentData: EnrollmentSchema) => {
  return prisma.enrollment.create({
    data: enrollmentData,
  });
};

export const getEnrollmentsByStudentIdModel = async (studentId: number) => {
  return prisma.enrollment.findMany({
    where: { studentId },
  });
};

export const getEnrollmentsByTermIdModel = async (termId: number) => {
  return prisma.enrollment.findMany({
    where: { termId },
  });
};
export const getAllEnrollmentsModel = async () => {
  return prisma.enrollment.findMany();
};

export const changeEnrollmentStatusModel = async (
  data: ChangeEnrollmentStatusSchema
) => {
  return prisma.enrollment.updateMany({
    where: { studentId: data.studentId },
    data: { status: data.enrollmentStatus },
  });
};

export const deleteEnrollmentModel = async (enrollmentId: number) => {
  return prisma.enrollment.delete({
    where: { enrollmentId: enrollmentId },
  });
};
