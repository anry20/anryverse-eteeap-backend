// models/student.model.ts
import prisma from "../utils/db";
import type {
  CreateStudentSchema,
  UpdateStudentSchema,
} from "../schemas/student";
import { AppError } from "../middlewares/errorHandler";
import { updateStudentInfoController } from "../controllers/studentsController";

export const getStudentsModel = async () => {
  return prisma.student.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      course: true,
      enrollments: {
        include: {
          subject: true,
          faculty: true,
          term: true,
          grade: true,
        },
      },
    },
  });
};

export const getStudentByIdModel = async (id: number) => {
  return prisma.student.findUnique({
    where: { studentId: id },
    include: {
      course: true,
      enrollments: {
        include: {
          subject: true,
          faculty: true,
          term: true,
          grade: true, // Include if you want detailed grades
        },
      },
    },
  });
};

export const getStudentByUserIdModel = async (userId: number) => {
  return prisma.student.findUnique({
    where: { userId },
    include: {
      course: true,
      enrollments: {
        include: {
          subject: true,
          faculty: true,
          term: true,
          grade: true,
        },
      },
    },
  });
};

export const createStudentModel = async (data: CreateStudentSchema) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Create the User
    const user = await tx.user.create({
      data: {
        username: data.username,
        password: data.password,
        email: data.email,
        role: "student",
      },
    });

    // 2. Create the Student
    const student = await tx.student.create({
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
        registrarSeal: "Empty",
      },
    });

    // 3. Find the currently active term
    const activeTerm = await tx.term.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" }, // just in case there are multiple, pick latest
    });
    if (!activeTerm) {
      const err = new Error("No active term found, enrollment cannot proceed.");
      (err as AppError).status = 404;
      throw err;
    }

    // 4. Find all subjects assigned to the course
    const courseSubjects = await tx.courseSubject.findMany({
      where: { courseId: data.courseId },
      include: { subject: true },
    });

    // 5. If no subjects are found, rollback the transaction
    if (!courseSubjects.length) {
      const err = new Error("No subjects assigned to course.");
      (err as AppError).status = 404;
      throw err;
    }

    // 6. Enroll the student in each subject, assigning faculty based on subject-faculty mapping
    await Promise.all(
      courseSubjects.map(async (cs) => {
        const subjectFaculty = await tx.subjectFaculty.findFirst({
          where: { subjectCode: cs.subjectCode },
        });

        if (!subjectFaculty) {
          const err = new Error(
            `No faculty assigned for subject ${cs.subject.subjectCode}, rolling back.`
          );
          (err as AppError).status = 404;
          throw err;
        }

        await tx.enrollment.create({
          data: {
            studentId: student.studentId,
            subjectCode: cs.subject.subjectCode,
            termId: activeTerm.termId,
            facultyId: subjectFaculty.facultyId,
            // Add any additional enrollment fields if needed
          },
        });
      })
    );

    return student;
  });
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
