import { AppError } from "../middlewares/errorHandler";
import prisma from "../utils/db";

export async function getClassListModel(userId: number) {
  const faculty = await prisma.faculty.findUnique({
    where: { userId: userId },
    select: { facultyId: true },
  });

  const enrollments = await prisma.enrollment.findMany({
    where: {
      facultyId: faculty!.facultyId,
      student: {
        admitted: true,
      },
    },

    select: {
      enrollmentId: true,
      subject: true,
      student: {
        select: {
          firstName: true,
          lastName: true,
          studentId: true,
          course: { select: { courseName: true } },
        },
      },
      grade: { select: { grade: true } },
    },
  });

  return enrollments;
}

export async function getClassListBySubjectModel(
  userId: number,
  subjectCode: string
) {
  const faculty = await prisma.faculty.findUnique({
    where: { userId: userId },
    select: { facultyId: true },
  });

  const enrollments = await prisma.enrollment.findMany({
    where: {
      facultyId: faculty!.facultyId,
      subject: {
        subjectCode: subjectCode,
      },
      student: {
        admitted: true,
      },
    },
    select: {
      enrollmentId: true,
      subject: true,
      student: {
        select: {
          firstName: true,
          lastName: true,
          studentId: true,
          course: { select: { courseName: true } },
        },
      },
      grade: { select: { grade: true } },
    },
  });

  return enrollments;
}

export async function getClassListStudentProfileModel(
  userId: number,
  studentId: number
) {
  // Get faculty ID
  const faculty = await prisma.faculty.findUnique({
    where: { userId: userId },
    select: { facultyId: true },
  });

  // Verify the faculty has access to this student through enrollment
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentId: studentId,
      facultyId: faculty!.facultyId,
    },
  });

  if (!enrollment) {
    const err = new Error(
      "Unauthorized: You do not have access to this student"
    );
    (err as AppError).status = 403;
    throw err;
  }

  // Get student with enrollments and related data
  const student = await prisma.student.findUnique({
    where: { studentId: studentId, admitted: true },
    omit: { registrarSeal: true, admitted: true, courseId: true, userId: true },
  });

  return student;
}

export async function addStudentGradeModel(
  enrollmentId: number,
  grade: number,
  userId: number
) {
  // Get faculty ID for the user
  const faculty = await prisma.faculty.findUnique({
    where: { userId: userId },
    select: { facultyId: true },
  });

  // Verify the enrollment belongs to this faculty
  const enrollment = await prisma.enrollment.findUnique({
    where: { enrollmentId: enrollmentId },
    select: { facultyId: true, student: { select: { admitted: true } } },
  });

  if (!enrollment) {
    const err = new Error("Not found: Enrollment does not exist");
    (err as AppError).status = 404;
    throw err;
  }

  if (
    enrollment.facultyId !== faculty!.facultyId ||
    !enrollment.student.admitted
  ) {
    const err = new Error(
      "Unauthorized: You are not assigned to this enrollment or student is not admitted"
    );
    (err as AppError).status = 403;
    throw err;
  }

  // Proceed with grade update only if authorized
  const updatedGrade = await prisma.grade.upsert({
    where: { enrollmentId: enrollmentId },
    update: { grade: grade },
    create: { enrollmentId: enrollmentId, grade: grade },
  });

  return updatedGrade;
}
