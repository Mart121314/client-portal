import { prisma } from "../database/prisma";

const REJECTED_REQUEST_GRACE_MS = 24 * 60 * 60 * 1000;
const CANCELLED_PROJECT_GRACE_MS = 30 * 24 * 60 * 60 * 1000;

export async function runCleanup() {
  const now = Date.now();

  const { count: requestsDeleted } = await prisma.serviceRequest.deleteMany({
    where: {
      status: "REJECTED",
      updatedAt: { lt: new Date(now - REJECTED_REQUEST_GRACE_MS) },
    },
  });

  const { count: projectsDeleted } = await prisma.project.deleteMany({
    where: {
      status: "CANCELLED",
      cancelledAt: { lt: new Date(now - CANCELLED_PROJECT_GRACE_MS) },
    },
  });

  if (requestsDeleted > 0 || projectsDeleted > 0) {
    console.log(`Cleanup: removed ${requestsDeleted} declined request(s), ${projectsDeleted} cancelled project(s)`);
  }
}
