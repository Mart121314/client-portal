import { Router } from "express";
import { requireAuth, requireRole, requireSuperAdmin } from "../middleware/authMiddleware";
import { list, getOne, promote, getProjects, getMessages } from "../controllers/userController";

const router = Router();

router.get("/", requireAuth, requireRole("ADMIN"), list);
router.get("/:id", requireAuth, requireRole("ADMIN"), getOne);
router.get("/:id/projects", requireAuth, requireRole("ADMIN"), getProjects);
router.get("/:id/messages", requireAuth, requireRole("ADMIN"), getMessages);
router.patch("/:id/promote", requireAuth, requireRole("ADMIN"), requireSuperAdmin, promote);

export default router;
