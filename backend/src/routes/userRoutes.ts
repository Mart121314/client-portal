import { Router } from "express";
import { requireAuth, requireRole, requireSuperAdmin } from "../middleware/authMiddleware";
import { list, promote } from "../controllers/userController";

const router = Router();

router.get("/", requireAuth, requireRole("ADMIN"), list);
router.patch("/:id/promote", requireAuth, requireRole("ADMIN"), requireSuperAdmin, promote);

export default router;
