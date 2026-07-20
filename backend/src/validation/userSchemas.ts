import { z } from "zod";

export const setPasswordSchema = z.object({
  newPassword: z.string().min(8, "Passordet må være minst 8 tegn"),
});
