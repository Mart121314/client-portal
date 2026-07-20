import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { ProjectRequest } from "../middleware/projectAccessMiddleware";
import { createInvoice, getInvoicesForProject, getAllInvoices, updateInvoiceStatus } from "../services/invoiceService";

export async function create(req: ProjectRequest, res: Response) {
  const { amount, dueDate } = req.body;
  const invoice = await createInvoice(req.params.projectId, { amount, dueDate });
  res.status(201).json(invoice);
}

export async function list(req: ProjectRequest, res: Response) {
  const invoices = await getInvoicesForProject(req.params.projectId);
  res.json(invoices);
}

export async function listAll(_req: AuthRequest, res: Response) {
  const invoices = await getAllInvoices();
  res.json(invoices);
}

export async function updateStatus(req: ProjectRequest, res: Response) {
  const { status } = req.body;
  const invoice = await updateInvoiceStatus(req.params.id, status);
  res.json(invoice);
}
