import { compare, hash } from 'bcrypt-ts-edge';

// Hash password using bcrypt
export const hashPassword = async (plainPassword: string): Promise<string> => {
  return await hash(plainPassword, 10); // 10 salt rounds
};

// Compare password using bcrypt
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await compare(plainPassword, hashedPassword);
};
