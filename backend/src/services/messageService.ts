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

export async function markProjectMessagesRead(projectId: string) {
  const unread = await prisma.message.findMany({
    where: { projectId, readAt: null, sender: { role: "CLIENT" } },
    select: { id: true },
  });
  if (unread.length === 0) return;

  await prisma.message.updateMany({
    where: { id: { in: unread.map((m) => m.id) } },
    data: { readAt: new Date() },
  });
}
