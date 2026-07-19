import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  createServiceRequest,
  getServiceRequestsForClient,
  getAllServiceRequests,
  getServiceRequestById,
  approveServiceRequest,
  rejectServiceRequest,
  reopenServiceRequest,
} from "../services/serviceRequestService";

export async function create(req: AuthRequest, res: Response) {
  const { description } = req.body;
  const request = await createServiceRequest(req.userId!, description);
  res.status(201).json(request);
}

export async function list(req: AuthRequest, res: Response) {
  const requests =
    req.role === "ADMIN"
      ? await getAllServiceRequests()
      : await getServiceRequestsForClient(req.userId!);

  res.json(requests);
}

export async function getOne(req: AuthRequest, res: Response) {
  const request = await getServiceRequestById(req.params.id);
  if (!request) {
    return res.status(404).json({ error: "Tjenesteforespørsel ikke funnet" });
  }

  if (req.role !== "ADMIN" && request.clientId !== req.userId) {
    return res.status(403).json({ error: "Ingen tilgang" });
  }

  res.json(request);
}

export async function approve(req: AuthRequest, res: Response) {
  const { title } = req.body;
  const project = await approveServiceRequest(req.params.id, title);
  if (!project) {
    return res.status(404).json({ error: "Tjenesteforespørsel ikke funnet" });
  }

  res.json(project);
}

export async function reject(req: AuthRequest, res: Response) {
  const request = await rejectServiceRequest(req.params.id);
  res.json(request);
}

export async function reopen(req: AuthRequest, res: Response) {
  const request = await reopenServiceRequest(req.params.id);
  res.json(request);
}
