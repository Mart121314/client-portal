import { prisma } from "../database/prisma";

export async function getConversationsForAdmin() {
  const projects = await prisma.project.findMany({
    where: { messages: { some: {} } },
    include: {
      client: { select: { email: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        include: { sender: { select: { id: true, email: true, role: true } } },
      },
    },
  });

  return projects
    .map((project) => {
      const unreadCount = project.messages.filter((m) => m.sender.role === "CLIENT" && !m.readAt).length;
      return {
        projectId: project.id,
        projectTitle: project.title,
        clientEmail: project.client.email,
        lastMessage: project.messages[0] ?? null,
        unreadCount,
      };
    })
    .sort((a, b) => {
      const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return bTime - aTime;
    });
}

export async function getUnreadCountForAdmin() {
  return prisma.message.count({
    where: { readAt: null, sender: { role: "CLIENT" } },
  });
}
