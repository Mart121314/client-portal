import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { getConversationsForAdmin, getUnreadCountForAdmin } from "../services/conversationService";

export async function list(_req: AuthRequest, res: Response) {
  const conversations = await getConversationsForAdmin();
  res.json(conversations);
}

export async function unreadCount(_req: AuthRequest, res: Response) {
  const count = await getUnreadCountForAdmin();
  res.json({ count });
}
