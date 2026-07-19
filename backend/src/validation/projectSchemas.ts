import { z } from "zod";

export const updateProjectSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
  notes: z.string().optional(),
  progressPercent: z.number().int().min(0).max(100).optional(),
  eta: z.string().optional(),
});
