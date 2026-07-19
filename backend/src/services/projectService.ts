import { prisma } from "../database/prisma";

export async function listProjectsForClient(clientId: string) {
  return prisma.project.findMany({
    where: { clientId },
    orderBy: { createdAt: "desc" },
  });
}

export async function listAllProjects() {
  return prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({ where: { id } });
}

export async function updateProject(
  id: string,
  data: {
    title?: string;
    description?: string;
    status?: "ACTIVE" | "COMPLETED" | "CANCELLED";
    customerNotes?: string;
    internalNotes?: string;
    progressPercent?: number | null;
    eta?: string | null;
  }
) {
  return prisma.project.update({
    where: { id },
    data: {
      ...data,
      progressPercent: data.progressPercent ?? undefined,
      eta: !data.eta ? (data.eta === undefined ? undefined : null) : new Date(data.eta),
    },
  });
}
