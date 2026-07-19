import { z } from "zod";

export const updateProjectSchema = z.object({
  title: z.string().min(1, "Tittel er påkrevd").optional(),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
  customerNotes: z.string().optional(),
  internalNotes: z.string().optional(),
  progressPercent: z
    .number()
    .int()
    .min(0, "Fremdrift kan ikke være negativ")
    .max(100, "Fremdrift kan ikke være over 100")
    .nullable()
    .optional(),
  eta: z.string().nullable().optional(),
});
