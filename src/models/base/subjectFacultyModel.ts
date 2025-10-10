import { AppError } from "../../middlewares/errorHandler";
import prisma from "../../utils/db";

export const assignFacultyToSubjectModel = async (
  subjectCode: string,
  facultyId: number
) => {
  const [existingSubject, existingFaculty] = await Promise.all([
    prisma.subject.findUnique({ where: { subjectCode } }),
    prisma.faculty.findUnique({ where: { facultyId } }),
  ]);

  if (!existingSubject || !existingFaculty) {
    const missing = !existingSubject ? "Subject" : "Faculty";
    const err = new Error(`${missing} not found`);
    (err as AppError).status = 404;
    throw err;
  }

  // Check if this faculty is already assigned to the subject
  const existingAssignment = await prisma.subjectFaculty.findFirst({
    where: {
      subjectCode,
      facultyId,
    },
  });

  if (existingAssignment) {
    const err = new Error("This faculty is already assigned to the subject");
    (err as AppError).status = 400;
    throw err;
  }

  // Create new assignment only if none exists yet
  return await prisma.subjectFaculty.create({
    data: {
      subjectCode,
      facultyId,
    },
  });
};

//Get faculty assignments by facultyId
export const getFacultyAssignmentsByFacultyIdModel = async (
  facultyId: number
) => {
  return await prisma.subjectFaculty.findMany({
    where: { facultyId },
    include: { subject: true },
  });
};

// Get all faculties assigned to a subject
export const getFacultyForSubjectModel = async (id: string) => {
  return await prisma.subjectFaculty.findMany({
    where: { subjectCode: id },
    include: { faculty: true },
  });
};

// Remove faculty assignment by subjectFacultyId
export const removeFacultyFromSubjectModel = async (id: number) => {
  const existingAssignment = await prisma.subjectFaculty.findUnique({
    where: { subjectFacultyId: id },
  });

  if (!existingAssignment) {
    return null;
  }

  return await prisma.subjectFaculty.delete({
    where: { subjectFacultyId: id },
  });
};
