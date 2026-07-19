import { prisma } from "../database/prisma";

export async function createDeliverable(
  projectId: string,
  data: { title: string; description?: string; dueDate?: string }
) {
  return prisma.deliverable.create({
    data: { projectId, ...data, dueDate: data.dueDate ? new Date(data.dueDate) : undefined },
  });
}

export async function getDeliverablesForProject(projectId: string) {
  return prisma.deliverable.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateDeliverableStatus(id: string, status: "PENDING" | "DELIVERED") {
  return prisma.deliverable.update({ where: { id }, data: { status } });
}
