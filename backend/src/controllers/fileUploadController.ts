import { Response } from "express";
import { ProjectRequest } from "../middleware/projectAccessMiddleware";
import { createFileUpload, getFilesForProject } from "../services/fileUploadService";

export async function create(req: ProjectRequest, res: Response) {
  const { filename, url, mimeType, size } = req.body;
  const file = await createFileUpload(req.params.projectId, req.userId!, { filename, url, mimeType, size });
  res.status(201).json(file);
}

export async function list(req: ProjectRequest, res: Response) {
  const files = await getFilesForProject(req.params.projectId);
  res.json(files);
}
