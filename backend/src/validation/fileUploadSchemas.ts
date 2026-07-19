import { z } from "zod";

export const createFileUploadSchema = z.object({
  filename: z.string().min(1, "Filnavn er påkrevd"),
  url: z.string().url("Ugyldig URL"),
  mimeType: z.string().min(1, "Filtype er påkrevd"),
  size: z.number().int().positive("Størrelse må være et positivt tall"),
});
