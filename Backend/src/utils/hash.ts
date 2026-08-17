import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Hash un mot de passe
 */
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Vérifie un mot de passe
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  return await bcrypt.compare(password, hashedPassword);
};
