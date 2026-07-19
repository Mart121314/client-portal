import { Response } from "express";
import { ProjectRequest } from "../middleware/projectAccessMiddleware";
import { createDeliverable, getDeliverablesForProject, updateDeliverableStatus } from "../services/deliverableService";

export async function create(req: ProjectRequest, res: Response) {
  const { title, description, dueDate } = req.body;
  const deliverable = await createDeliverable(req.params.projectId, { title, description, dueDate });
  res.status(201).json(deliverable);
}

export async function list(req: ProjectRequest, res: Response) {
  const deliverables = await getDeliverablesForProject(req.params.projectId);
  res.json(deliverables);
}

export async function updateStatus(req: ProjectRequest, res: Response) {
  const { status } = req.body;
  const deliverable = await updateDeliverableStatus(req.params.id, status);
  res.json(deliverable);
}
