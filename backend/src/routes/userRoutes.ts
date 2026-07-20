import { Router } from "express";
import { requireAuth, requireRole, requireSuperAdmin } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { setPasswordSchema } from "../validation/userSchemas";
import { list, getOne, promote, getProjects, getMessages, setPassword } from "../controllers/userController";

const router = Router();

router.get("/", requireAuth, requireRole("ADMIN"), list);
router.get("/:id", requireAuth, requireRole("ADMIN"), getOne);
router.get("/:id/projects", requireAuth, requireRole("ADMIN"), getProjects);
router.get("/:id/messages", requireAuth, requireRole("ADMIN"), getMessages);
router.patch("/:id/promote", requireAuth, requireRole("ADMIN"), requireSuperAdmin, promote);
router.patch(
  "/:id/password",
  requireAuth,
  requireRole("ADMIN"),
  requireSuperAdmin,
  validate(setPasswordSchema),
  setPassword,
);

export default router;
