import { prisma } from "../database/prisma";

export async function createFileUpload(
  projectId: string,
  uploadedById: string,
  data: { filename: string; url: string; mimeType: string; size: number }
) {
  return prisma.fileUpload.create({
    data: { projectId, uploadedById, ...data },
  });
}

export async function getFilesForProject(projectId: string) {
  return prisma.fileUpload.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}
