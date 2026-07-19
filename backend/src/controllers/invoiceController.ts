import { Response } from "express";
import { ProjectRequest } from "../middleware/projectAccessMiddleware";
import { createInvoice, getInvoicesForProject, updateInvoiceStatus } from "../services/invoiceService";

export async function create(req: ProjectRequest, res: Response) {
  const { amount, dueDate } = req.body;
  const invoice = await createInvoice(req.params.projectId, { amount, dueDate });
  res.status(201).json(invoice);
}

export async function list(req: ProjectRequest, res: Response) {
  const invoices = await getInvoicesForProject(req.params.projectId);
  res.json(invoices);
}

export async function updateStatus(req: ProjectRequest, res: Response) {
  const { status } = req.body;
  const invoice = await updateInvoiceStatus(req.params.id, status);
  res.json(invoice);
}
