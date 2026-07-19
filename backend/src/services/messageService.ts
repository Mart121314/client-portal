import { prisma } from "../database/prisma";

export async function createMessage(projectId: string, senderId: string, content: string) {
  return prisma.message.create({
    data: { projectId, senderId, content },
  });
}

export async function getMessagesForProject(projectId: string) {
  return prisma.message.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  });
}
