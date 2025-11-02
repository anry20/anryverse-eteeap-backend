import {
  CreateFacultySchema,
  CreateSubjectSchema,
  CreateTermSchema,
  UpdateFacultySchema,
  UpdateStudentSchema,
  UpdateSubjectSchema,
} from "../schemas/adminApiSchemas";
import prisma from "../utils/db";
import { AppError } from "../middlewares/errorHandler";

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
    const err = new Error("Student Not Found");
    (err as AppError).status = 404;
    throw err;
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
    const student = await prisma.student.findUnique({
      where: { studentId },
      select: { userId: true },
    });
    if (!student) {
      const err = new Error("Student Not Found");
      (err as AppError).status = 404;
      throw err;
    }
    return prisma.user.delete({
      where: { userId: student.userId },
    });
  } catch (error) {
    throw new Error("Error Deleting Student");
  }
};

//Faculty Management Model

export const getAllFacultiesModel = async () => {
  try {
    const faculties = await prisma.faculty.findMany();
    return faculties;
  } catch (error) {
    throw new Error("Error Fetching Faculties");
  }
};

export const getFacultyDetailsModel = async (facultyId: number) => {
  try {
    const faculty = await prisma.faculty.findUnique({
      where: { facultyId },
    });
    return faculty;
  } catch (error) {
    throw new Error("Error Fetching Faculty Details");
  }
};

export const createFacultyModel = async (data: CreateFacultySchema) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: data.password,
        email: data.email,
        role: "faculty",
      },
    });

    const faculty = await prisma.faculty.create({
      data: {
        userId: user.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        contactNo: data.contactNo,
      },
      include: {
        user: true,
      },
    });

    return faculty;
  } catch (error) {
    throw new Error("Error Creating Faculty");
  }
};

export const updateFacultyModel = async (
  facultyId: number,
  data: UpdateFacultySchema
) => {
  try {
    const existingFaculty = await prisma.faculty.findUnique({
      where: { facultyId },
    });

    if (!existingFaculty) {
      const err = new Error("Faculty Not Found");
      (err as AppError).status = 404;
      throw err;
    }

    const faculty = await prisma.faculty.update({
      where: { facultyId },
      data,
      include: {
        user: true,
      },
    });

    return faculty;
  } catch (error) {
    throw new Error("Error Updating Faculty");
  }
};

export const deleteFacultyModel = async (facultyId: number) => {
  try {
    const faculty = await prisma.faculty.findUnique({
      where: { facultyId },
      select: { userId: true },
    });

    if (!faculty) {
      const err = new Error("Faculty Not Found");
      (err as AppError).status = 404;
      throw err;
    }

    return prisma.user.delete({
      where: { userId: faculty.userId },
    });
  } catch (error) {
    throw new Error("Error Deleting Faculty");
  }
};

export const getAllAdminModel = async () => {
  try {
    return await prisma.admin.findMany();
  } catch (error) {
    throw new Error("Error Fetching Admin");
  }
};

export const getAdminDetailsModel = async (adminId: number) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { adminId },
    });
    return admin;
  } catch (error) {
    throw new Error("Error Fetching Admin Details");
  }
};

//Faculty Subject Assignment Model
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

  return await prisma.subjectFaculty.create({
    data: {
      subjectCode,
      facultyId,
    },
  });
};

export const getFacultyAssignmentsByFacultyIdModel = async (
  facultyId: number
) => {
  return await prisma.subjectFaculty.findMany({
    where: { facultyId },
    include: { subject: true },
  });
};

export const getFacultyForSubjectModel = async (id: string) => {
  return await prisma.subjectFaculty.findMany({
    where: { subjectCode: id },
    include: { faculty: true },
  });
};

export const unAssignFacultyFromSubjectModel = async (
  subjectFacultyId: number
) => {
  const existingAssignment = await prisma.subjectFaculty.findUnique({
    where: { subjectFacultyId },
  });

  if (!existingAssignment) {
    const err = new Error("Assignment Don't Exist");
    (err as AppError).status = 404;
    throw err;
  }

  return await prisma.subjectFaculty.delete({
    where: { subjectFacultyId },
  });
};

// Term Management Model
export const getAllTermsModel = async () => {
  return await prisma.term.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const createTermModel = async (data: CreateTermSchema) => {
  return prisma.term.create({ data });
};

export const deleteTermModel = async (id: number) => {
  const existingTerm = await prisma.term.findUnique({
    where: { termId: id },
  });

  if (!existingTerm) {
    const err = new Error("Term Not Found");
    (err as AppError).status = 404;
    throw err;
  }

  return prisma.term.delete({ where: { termId: id } });
};

export const activateTermModel = async (termId: number) => {
  const existingTerm = await prisma.term.findUnique({
    where: { termId },
  });

  if (!existingTerm) {
    const err = new Error("Term Not Found");
    (err as AppError).status = 404;
    throw err;
  }

  const currentActiveTerm = await prisma.term.findFirst({
    where: { isActive: true },
  });

  if (currentActiveTerm === existingTerm) {
    const err = new Error("Term is already active");
    (err as AppError).status = 400;
    throw err;
  }

  if (currentActiveTerm) {
    await prisma.term.update({
      where: { termId: currentActiveTerm.termId },
      data: { isActive: false },
    });
  }

  return prisma.term.update({
    where: { termId },
    data: { isActive: true },
  });
};
