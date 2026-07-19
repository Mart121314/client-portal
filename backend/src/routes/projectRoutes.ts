import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware";
import { requireProjectAccess } from "../middleware/projectAccessMiddleware";
import { list, getOne } from "../controllers/projectController";

const router = Router();

router.get("/", requireAuth, list);
router.get("/:projectId", requireAuth, requireProjectAccess, getOne);

export default router;
