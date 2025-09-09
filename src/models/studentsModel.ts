// models/student.model.ts
import prisma from "../utils/db";
import type {
  CreateStudentSchema,
  UpdateStudentSchema,
} from "../schemas/student";

export const getStudentsModel = async () => {
  return prisma.student.findMany({ orderBy: { createdAt: "desc" } });
};

export const getStudentByIdModel = async (id: number) => {
  return prisma.student.findUnique({ where: { studentId: id } });
};

export const createStudentModel = async (data: CreateStudentSchema) => {
  const user = await prisma.user.create({
    data: {
      username: data.username,
      password: data.password,
      email: data.email,
      role: "student",
    },
  });

  const student = await prisma.student.create({
    data: {
      userId: user.userId,
      courseId: data.courseId,
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      address: data.address,
      sex: data.sex,
      dateEnrolled: data.dateEnrolled,
      placeOfBirth: data.placeOfBirth,
      nationality: data.nationality,
      religion: data.religion,
      contactNo: data.contactNo,
      civilStatus: data.civilStatus,
    },
    include: {
      user: true,
    },
  });

  return student;
};

export const updateStudentModel = async (
  studentId: number,
  data: UpdateStudentSchema
) => {
  const existingStudent = await prisma.student.findUnique({
    where: { studentId },
  });

  if (!existingStudent) {
    return null; // let the controller handle the 404
  }

  const student = await prisma.student.update({
    where: { studentId },
    data,
    include: {
      user: true,
      course: true,
    },
  });

  return student;
};

export const deleteStudentModel = async (studentId: number) => {
  const student = await prisma.student.findUnique({
    where: { studentId },
    select: { userId: true },
  });

  if (!student) return null;

  return prisma.user.delete({
    where: { userId: student.userId },
  });
};
