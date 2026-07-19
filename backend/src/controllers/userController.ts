import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { listUsers, promoteToAdmin } from "../services/userService";

export async function list(_req: AuthRequest, res: Response) {
  const users = await listUsers();
  res.json(users);
}

export async function promote(req: AuthRequest, res: Response) {
  const user = await promoteToAdmin(req.params.id);
  res.json({ id: user.id, email: user.email, role: user.role });
}
