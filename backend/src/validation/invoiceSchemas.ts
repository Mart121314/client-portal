import { z } from "zod";

export const createInvoiceSchema = z.object({
  amount: z.number().positive(),
  dueDate: z.string().datetime().optional(),
});

export const updateInvoiceStatusSchema = z.object({
  status: z.enum(["UNPAID", "PAID", "OVERDUE"]),
});
