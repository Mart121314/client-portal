import { Request, Response } from "express";
import {
  registerUser,
  validateUser,
  generateToken,
  requestPasswordReset,
  resetPassword,
} from "../services/authService";
import { AuthRequest } from "../middleware/authMiddleware";
import { prisma } from "../database/prisma";

export async function me(req: AuthRequest, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ id: user.id, email: user.email, role: user.role });
}

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const user = await registerUser(email, password);
    res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch {
    res.status(400).json({ error: "Could not create user (email may already be in use)" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await validateUser(email, password);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = generateToken(user.id, user.role);
  res.json({ token });
}

export async function logout(req: AuthRequest, res: Response) {
  if (req.jti && req.tokenExp) {
    await prisma.revokedToken.create({
      data: { jti: req.jti, expiresAt: new Date(req.tokenExp * 1000) },
    });
  }
  res.json({ message: "Logged out" });
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  const resetToken = await requestPasswordReset(email);

  res.json({
    message: "If that email exists, a reset token has been issued.",
    resetToken: resetToken ?? undefined,
  });
}

export async function resetPasswordHandler(req: Request, res: Response) {
  const { token, newPassword } = req.body;
  const success = await resetPassword(token, newPassword);

  if (!success) {
    return res.status(400).json({ error: "Invalid or expired reset token" });
  }

  res.json({ message: "Password has been reset" });
}
