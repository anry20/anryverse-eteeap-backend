import prisma from "../utils/db";
import { CreateSubjectSchema, UpdateSubjectSchema } from "../schemas/subject";

export const getSubjectsModel = async () => {
  return await prisma.subject.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getSubjectByIdModel = async (id: string) => {
  return await prisma.subject.findUnique({ where: { subjectId: id } });
};

export const createSubjectModel = async (data: CreateSubjectSchema) => {
  return prisma.subject.create({ data });
};

export const updateSubjectModel = async (
  id: string,
  data: UpdateSubjectSchema
) => {
  return prisma.subject.update({ where: { subjectId: id }, data });
};

export const deleteSubjectModel = async (id: string) => {
  return prisma.subject.delete({ where: { subjectId: id } });
};
