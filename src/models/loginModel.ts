import prisma from "../utils/db";

export const loginModel = async (credential: string) => {
  return prisma.user.findFirst({
    where: {
      OR: [{ email: credential }, { username: credential }],
    },
  });
};
