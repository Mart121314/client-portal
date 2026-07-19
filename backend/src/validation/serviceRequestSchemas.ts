import { z } from "zod";

export const createServiceRequestSchema = z.object({
  description: z.string().min(1, "Beskrivelse er påkrevd"),
});

export const approveServiceRequestSchema = z.object({
  title: z.string().min(1, "Prosjekttittel er påkrevd"),
});
