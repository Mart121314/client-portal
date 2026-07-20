import { prisma } from "../database/prisma";

export async function listUsers() {
  return prisma.user.findMany({
    select: { id: true, email: true, role: true, isActive: true, isSuperAdmin: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function promoteToAdmin(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { role: "ADMIN" },
  });
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    select: { id: true, email: true, role: true, isActive: true, isSuperAdmin: true, createdAt: true },
    where: { id: userId },
  });
}

export async function getProjectsForUser(userId: string) {
  return prisma.project.findMany({
    where: { clientId: userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMessagesForUser(userId: string) {
  return prisma.message.findMany({
    where: { senderId: userId },
    orderBy: { createdAt: "desc" },
    include: { project: { select: { id: true, title: true } } },
  });
}
