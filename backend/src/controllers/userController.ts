import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  listUsers,
  promoteToAdmin,
  getUserById,
  getProjectsForUser,
  getMessagesForUser,
  setUserPassword,
} from "../services/userService";

export async function list(_req: AuthRequest, res: Response) {
  const users = await listUsers();
  res.json(users);
}

export async function getOne(req: AuthRequest, res: Response) {
  const user = await getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "Bruker ikke funnet" });
  }
  res.json(user);
}

export async function promote(req: AuthRequest, res: Response) {
  const user = await promoteToAdmin(req.params.id);
  res.json({ id: user.id, email: user.email, role: user.role });
}

export async function getProjects(req: AuthRequest, res: Response) {
  const projects = await getProjectsForUser(req.params.id);
  res.json(projects);
}

export async function getMessages(req: AuthRequest, res: Response) {
  const messages = await getMessagesForUser(req.params.id);
  res.json(messages);
}

export async function setPassword(req: AuthRequest, res: Response) {
  await setUserPassword(req.params.id, req.body.newPassword);
  res.json({ message: "Passord oppdatert" });
}
