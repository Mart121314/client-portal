import { prisma } from "../database/prisma";

const senderSelect = { sender: { select: { id: true, email: true, role: true } } } as const;

export async function createMessage(projectId: string, senderId: string, content: string) {
  return prisma.message.create({
    data: { projectId, senderId, content },
    include: senderSelect,
  });
}

export async function getMessagesForProject(projectId: string) {
  return prisma.message.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    include: senderSelect,
  });
}
