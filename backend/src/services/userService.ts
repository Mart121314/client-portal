import { prisma } from "../database/prisma";

export async function listUsers() {
  return prisma.user.findMany({
    select: { id: true, email: true, role: true, isActive: true, createdAt: true },
  });
}

export async function promoteToAdmin(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { role: "ADMIN" },
  });
}
