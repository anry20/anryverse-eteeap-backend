import {
  CreateSubjectSchema,
  UpdateStudentSchema,
  UpdateSubjectSchema,
} from "../schemas/adminApiSchemas";
import prisma from "../utils/db";

// Subject Management Model

export const getAllSubjectsModel = async () => {
  try {
    const subjects = await prisma.subject.findMany();
    return subjects;
  } catch (error) {
    throw new Error("Error Fetching Subjects");
  }
};

export const addSubjectModel = async (subjectData: CreateSubjectSchema) => {
  try {
    const newSubject = await prisma.subject.create({
      data: subjectData,
    });
    return newSubject;
  } catch (error) {
    throw new Error("Error Adding Subject");
  }
};

export const updateSubjectModel = async (
  subjectCode: string,
  subjectData: UpdateSubjectSchema
) => {
  try {
    const updatedSubject = await prisma.subject.update({
      where: { subjectCode: subjectCode },
      data: subjectData,
    });
    return updatedSubject;
  } catch (error) {
    throw new Error("Error Updating Subject");
  }
};

export const deleteSubjectModel = async (subjectCode: string) => {
  try {
    await prisma.subject.delete({
      where: { subjectCode: subjectCode },
    });
  } catch (error) {
    throw new Error("Error Deleting Subject");
  }
};

//STUDENT MANAGEMENT MODEL

export const getAllStudentsModel = async () => {
  try {
    const students = await prisma.student.findMany({
      where: {
        admitted: true,
      },
      select: {
        studentId: true,
        firstName: true,
        lastName: true,
        course: true,
      },
    });
    return students;
  } catch (error) {
    throw new Error("Error Fetching Students");
  }
};

export const getStudentDetailsModel = async (studentId: number) => {
  try {
    const student = await prisma.student.findUnique({
      where: { studentId },
      include: {
        course: true,
        enrollments: true,
      },
    });
    return student;
  } catch (error) {
    throw new Error("Error Fetching Student Details");
  }
};

export const updateStudentModel = async (
  studentId: number,
  data: UpdateStudentSchema
) => {
  const existingStudent = await prisma.student.findUnique({
    where: { studentId },
  });

  if (!existingStudent) {
    throw new Error("Student Not Found");
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
  try {
    await prisma.student.delete({
      where: { studentId },
    });
  } catch (error) {
    throw new Error("Error Deleting Student");
  }
};
