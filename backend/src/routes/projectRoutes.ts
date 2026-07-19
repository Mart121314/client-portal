import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware";
import { requireProjectAccess } from "../middleware/projectAccessMiddleware";
import { validate } from "../middleware/validate";
import { updateProjectSchema } from "../validation/projectSchemas";
import { list, getOne, update } from "../controllers/projectController";

const router = Router();

router.get("/", requireAuth, list);
router.get("/:projectId", requireAuth, requireProjectAccess, getOne);
router.patch(
  "/:projectId",
  requireAuth,
  requireProjectAccess,
  requireRole("ADMIN"),
  validate(updateProjectSchema),
  update
);

export default router;
