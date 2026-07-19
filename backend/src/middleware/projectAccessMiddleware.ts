import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import { prisma } from "../database/prisma";

export interface ProjectRequest extends AuthRequest {
  project?: { id: string; clientId: string };
}

export async function requireProjectAccess(req: ProjectRequest, res: Response, next: NextFunction) {
  const project = await prisma.project.findUnique({ where: { id: req.params.projectId } });
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  if (req.role !== "ADMIN" && project.clientId !== req.userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  req.project = project;
  next();
}
