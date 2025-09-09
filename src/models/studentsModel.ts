// models/student.model.ts
import prisma from "../utils/db";

export interface enrollStudentInput {
  username: string;
  password: string;
  studentId: string;
  courseId: string;
  firstName: string;
  lastName: string;
  middleInitial?: string;
  address: string;
  sex: "Male" | "Female";
  dateEnrolled: Date;
  placeOfBirth: string;
  nationality?: string;
  religion?: string;
  contactNo?: string;
  civilStatus?:
    | "Single"
    | "Married"
    | "Widowed"
    | "Separated"
    | "Annulled"
    | "Divorced";
}

export const getAllStudentsModel = async () => {
  return prisma.student.findMany({ orderBy: { createdAt: "desc" } });
};

export const getStudentByIdModel = async (id: string) => {
  return prisma.student.findUnique({ where: { studentId: id } });
};

export const enrollStudentModel = async (data: enrollStudentInput) => {
  const user = await prisma.user.create({
    data: {
      username: data.username,
      password: data.password,
      role: "student",
    },
  });

  const student = await prisma.student.create({
    data: {
      userId: user.userId,
      courseId: data.courseId,
      firstName: data.firstName,
      lastName: data.lastName,
      middleInitial: data.middleInitial,
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
      course: true,
    },
  });

  return student;
};

export const deleteStudentModel = async (studentId: string) => {
  const student = await prisma.student.findUnique({
    where: { studentId },
    select: { userId: true },
  });

  if (!student) return null;

  return prisma.user.delete({
    where: { userId: student.userId },
  });
};
