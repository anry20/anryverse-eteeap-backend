import {
  CreateSubjectSchema,
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
