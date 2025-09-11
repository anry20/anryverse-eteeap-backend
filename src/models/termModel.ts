import prisma from "../utils/db";
import { CreateTermSchema, UpdateTermSchema } from "../schemas/term";

export const getTermsModel = async () => {
  return await prisma.term.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getTermByIdModel = async (id: number) => {
  return await prisma.term.findUnique({ where: { termId: id } });
};

export const createTermModel = async (data: CreateTermSchema) => {
  return prisma.term.create({ data });
};

export const updateTermModel = async (id: number, data: UpdateTermSchema) => {
  const existingTerm = await prisma.term.findUnique({
    where: { termId: id },
  });
  if (!existingTerm) {
    return null;
  }
  return prisma.term.update({ where: { termId: id }, data });
};

export const deleteTermModel = async (id: number) => {
  const existingTerm = await prisma.term.findUnique({
    where: { termId: id },
  });

  if (!existingTerm) {
    return null;
  }

  return prisma.term.delete({ where: { termId: id } });
};
