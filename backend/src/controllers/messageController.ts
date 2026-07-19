import { Response } from "express";
import { ProjectRequest } from "../middleware/projectAccessMiddleware";
import { createMessage, getMessagesForProject, markProjectMessagesRead } from "../services/messageService";

export async function create(req: ProjectRequest, res: Response) {
  const { content } = req.body;
  const message = await createMessage(req.params.projectId, req.userId!, content);
  res.status(201).json(message);
}

export async function list(req: ProjectRequest, res: Response) {
  const messages = await getMessagesForProject(req.params.projectId);
  res.json(messages);
}

export async function markRead(req: ProjectRequest, res: Response) {
  await markProjectMessagesRead(req.params.projectId);
  res.json({ message: "Meldinger markert som lest" });
}
