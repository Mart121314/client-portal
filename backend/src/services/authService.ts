import { randomUUID, randomBytes } from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../database/prisma";

const SALT_ROUNDS = 10;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export async function registerUser(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return prisma.user.create({
    data: { email, passwordHash },
  });
}

export async function validateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.passwordHash);
  return isValid ? user : null;
}

export function generateToken(userId: string, role: string) {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign({ sub: userId, role, jti: randomUUID() }, secret, { expiresIn: "1d" });
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const resetToken = randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry },
  });

  return resetToken;
}

export async function resetPassword(token: string, newPassword: string) {
  const user = await prisma.user.findFirst({
    where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
  });
  if (!user) return false;

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetToken: null, resetTokenExpiry: null },
  });

  return true;
}
