import prisma from "../utils/db";

export const loginModel = async (credential: string) => {
  return prisma.user.findFirst({
    where: {
      OR: [{ email: credential }, { username: credential }],
    },
  });
};

export const getSessionDetailsModel = async (sessionId: number) => {
  const user = await prisma.user.findUnique({
    where: { userId: sessionId },
    omit: {
      password: true,
      createdAt: true,
      updatedAt: true,
    },
    include: {
      students: { omit: { userId: true, createdAt: true, updatedAt: true } },
      faculty: { omit: { userId: true, createdAt: true, updatedAt: true } },
      admin: { omit: { userId: true, createdAt: true, updatedAt: true } },
    },
  });

  if (!user) return null;

  // Remove null relations
  return {
    ...user,
    students: user.students || undefined,
    faculty: user.faculty || undefined,
    admin: user.admin || undefined,
  };
};
