import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { ProjectRequest } from "../middleware/projectAccessMiddleware";
import { listProjectsForClient, listAllProjects, getProjectById, updateProject } from "../services/projectService";

export async function list(req: AuthRequest, res: Response) {
  const projects = req.role === "ADMIN" ? await listAllProjects() : await listProjectsForClient(req.userId!);
  res.json(projects);
}

export async function getOne(req: ProjectRequest, res: Response) {
  const project = await getProjectById(req.params.projectId);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }
  res.json(project);
}

export async function update(req: ProjectRequest, res: Response) {
  const { title, description, status } = req.body;
  const project = await updateProject(req.params.projectId, { title, description, status });
  res.json(project);
}
