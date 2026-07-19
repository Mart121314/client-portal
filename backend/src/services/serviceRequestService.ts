import { prisma } from "../database/prisma";

export async function createServiceRequest(clientId: string, description: string) {
  return prisma.serviceRequest.create({
    data: { clientId, description },
  });
}

export async function getServiceRequestsForClient(clientId: string) {
  return prisma.serviceRequest.findMany({ where: { clientId } });
}

export async function getAllServiceRequests() {
  return prisma.serviceRequest.findMany();
}

export async function getServiceRequestById(id: string) {
  return prisma.serviceRequest.findUnique({ where: { id } });
}

export async function approveServiceRequest(id: string, title: string) {
  const request = await prisma.serviceRequest.findUnique({ where: { id } });
  if (!request) return null;

  const [project] = await prisma.$transaction([
    prisma.project.create({
      data: {
        title,
        clientId: request.clientId,
        serviceRequestId: request.id,
      },
    }),
    prisma.serviceRequest.update({
      where: { id },
      data: { status: "APPROVED" },
    }),
  ]);

  return project;
}

export async function rejectServiceRequest(id: string) {
  return prisma.serviceRequest.update({
    where: { id },
    data: { status: "REJECTED" },
  });
}
