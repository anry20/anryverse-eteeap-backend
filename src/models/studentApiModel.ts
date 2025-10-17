import prisma from "../utils/db";
import { UpdateMyStudentInfoSchema } from "../schemas/base/student";
import { hashedPassword } from "../utils/hash";

export const getStudentByUserIdModel = async (userId: number) => {
  return prisma.student.findUnique({
    where: { userId },
    include: {
      user: {
        omit: {
          userId: true,
          password: true,
        },
      },
      course: true,
    },
  });
};

export const updateMyStudentInfoModel = async (
  userId: number,
  data: UpdateMyStudentInfoSchema
) => {
  const existingStudent = await prisma.student.findUnique({
    where: { userId },
  });

  if (!existingStudent) {
    return null;
  }

  const { password, ...studentData } = data;

  const student = await prisma.student.update({
    where: { userId },
    data: {
      ...studentData,
      user: {
        update: {
          password: await hashedPassword(password!),
        },
      },
    },
    include: {
      user: {
        omit: {
          userId: true,
          password: true,
        },
      },
    },
  });

  return student;
};

export const getStudentEnrollmentsModel = async (userId: number) => {
  const student = await prisma.student.findUnique({
    where: { userId },
    select: { studentId: true },
  });

  if (!student) {
    return null;
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: student.studentId },
    omit: {
      subjectCode: true,
      facultyId: true,
      termId: true,
    },
    include: {
      subject: true,
      faculty: true,
      term: true,
      grade: true,
    },
  });

  return enrollments;
};
