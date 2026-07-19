import { z } from "zod";

export const createFileUploadSchema = z.object({
  filename: z.string().min(1),
  url: z.string().url(),
  mimeType: z.string().min(1),
  size: z.number().int().positive(),
});
