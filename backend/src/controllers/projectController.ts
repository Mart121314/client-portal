import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { ProjectRequest } from "../middleware/projectAccessMiddleware";
import { listProjectsForClient, listAllProjects, getProjectById, updateProject } from "../services/projectService";

function sanitize<T extends { internalNotes: string | null }>(project: T, isAdmin: boolean) {
  if (isAdmin) return project;
  const { internalNotes, ...rest } = project;
  return rest;
}

export async function list(req: AuthRequest, res: Response) {
  const isAdmin = req.role === "ADMIN";
  const projects = isAdmin ? await listAllProjects() : await listProjectsForClient(req.userId!);
  res.json(projects.map((p) => sanitize(p, isAdmin)));
}

export async function getOne(req: ProjectRequest, res: Response) {
  const project = await getProjectById(req.params.projectId);
  if (!project) {
    return res.status(404).json({ error: "Prosjekt ikke funnet" });
  }
  res.json(sanitize(project, req.role === "ADMIN"));
}

export async function update(req: ProjectRequest, res: Response) {
  const { title, description, status, customerNotes, internalNotes, progressPercent, eta } = req.body;
  const project = await updateProject(req.params.projectId, {
    title,
    description,
    status,
    customerNotes,
    internalNotes,
    progressPercent,
    eta,
  });
  if (!project) {
    return res.status(404).json({ error: "Prosjekt ikke funnet" });
  }
  res.json(project);
}
