import prisma from "../utils/db";
import { CreateSubjectSchema, UpdateSubjectSchema } from "../schemas/subject";

export const getSubjectsModel = async () => {
  return await prisma.subject.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getSubjectByIdModel = async (id: string) => {
  return await prisma.subject.findUnique({ where: { subjectCode: id } });
};

export const createSubjectModel = async (data: CreateSubjectSchema) => {
  return prisma.subject.create({ data });
};

export const updateSubjectModel = async (
  id: string,
  data: UpdateSubjectSchema
) => {
  const existingSubject = await prisma.subject.findUnique({
    where: { subjectCode: id },
  });
  if (!existingSubject) {
    return null;
  }
  return prisma.subject.update({ where: { subjectCode: id }, data });
};

export const deleteSubjectModel = async (id: string) => {
  const existingSubject = await prisma.subject.findUnique({
    where: { subjectCode: id },
  });

  if (!existingSubject) {
    return null;
  }

  return prisma.subject.delete({ where: { subjectCode: id } });
};
