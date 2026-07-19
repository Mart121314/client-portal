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
