import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware";
import { list, unreadCount } from "../controllers/conversationController";

const router = Router();

router.get("/", requireAuth, requireRole("ADMIN"), list);
router.get("/unread-count", requireAuth, requireRole("ADMIN"), unreadCount);

export default router;
