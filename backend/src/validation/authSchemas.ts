import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Ugyldig e-postadresse"),
  password: z.string().min(8, "Passordet må være minst 8 tegn"),
});

export const loginSchema = z.object({
  email: z.string().email("Ugyldig e-postadresse"),
  password: z.string().min(1, "Passord er påkrevd"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Ugyldig e-postadresse"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Tilbakestillingskode er påkrevd"),
  newPassword: z.string().min(8, "Passordet må være minst 8 tegn"),
});
