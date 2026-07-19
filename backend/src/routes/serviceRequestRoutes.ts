import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { createServiceRequestSchema, approveServiceRequestSchema } from "../validation/serviceRequestSchemas";
import { create, list, getOne, approve, reject } from "../controllers/serviceRequestController";

const router = Router();

router.post("/", requireAuth, validate(createServiceRequestSchema), create);
router.get("/", requireAuth, list);
router.get("/:id", requireAuth, getOne);
router.patch("/:id/approve", requireAuth, requireRole("ADMIN"), validate(approveServiceRequestSchema), approve);
router.patch("/:id/reject", requireAuth, requireRole("ADMIN"), reject);

export default router;
