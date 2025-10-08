import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashedPassword = async (password: string) => {
  return await bcrypt.hash(password, saltRounds);
};
