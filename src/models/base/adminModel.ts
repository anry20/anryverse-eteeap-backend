// models/student.model.ts
import prisma from "../../utils/db";
import type {
  CreateAdminSchema,
  UpdateAdminSchema,
} from "../../schemas/base/admin";

export const getAdminsModel = async () => {
  return prisma.admin.findMany({ orderBy: { createdAt: "desc" } });
};

export const getAdminByIdModel = async (id: number) => {
  return prisma.admin.findUnique({ where: { adminId: id } });
};

export const createAdminModel = async (data: CreateAdminSchema) => {
  const user = await prisma.user.create({
    data: {
      username: data.username,
      password: data.password,
      email: data.email,
      role: "admin",
    },
  });

  const admin = await prisma.admin.create({
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

  return admin;
};

export const updateAdminModel = async (
  adminId: number,
  data: UpdateAdminSchema
) => {
  const existingAdmin = await prisma.admin.findUnique({
    where: { adminId },
  });

  if (!existingAdmin) {
    return null; // let the controller handle the 404
  }

  const admin = await prisma.admin.update({
    where: { adminId },
    data,
    include: {
      user: true,
    },
  });

  return admin;
};

export const deleteAdminModel = async (adminId: number) => {
  const admin = await prisma.admin.findUnique({
    where: { adminId },
    select: { userId: true },
  });

  if (!admin) return null;

  return prisma.user.delete({
    where: { userId: admin.userId },
  });
};
