import { z } from "zod";

export const createDeliverableSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
});

export const updateDeliverableStatusSchema = z.object({
  status: z.enum(["PENDING", "DELIVERED"]),
});
