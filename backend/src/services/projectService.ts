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
    notes?: string;
    progressPercent?: number;
    eta?: string;
  }
) {
  return prisma.project.update({
    where: { id },
    data: {
      ...data,
      eta: data.eta === undefined ? undefined : data.eta ? new Date(data.eta) : null,
    },
  });
}
