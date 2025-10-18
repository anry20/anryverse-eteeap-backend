import prisma from "../utils/db";
import { CreateStudentSchema } from "../schemas/adminApiSchemas";
import { AppError } from "../middlewares/errorHandler";

export const enrollStudentModel = async (data: CreateStudentSchema) => {
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
      },
    });

    // 3. Find the currently active term
    const activeTerm = await tx.term.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
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
          },
        });
      })
    );

    return student;
  });
};
