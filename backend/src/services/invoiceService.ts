import { prisma } from "../database/prisma";

export async function createInvoice(projectId: string, data: { amount: number; dueDate?: string }) {
  return prisma.invoice.create({
    data: {
      projectId,
      amount: data.amount,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    },
  });
}

export async function getInvoicesForProject(projectId: string) {
  return prisma.invoice.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateInvoiceStatus(id: string, status: "UNPAID" | "PAID" | "OVERDUE") {
  return prisma.invoice.update({ where: { id }, data: { status } });
}
