import { Router } from "express";
import { requireRole } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { createDeliverableSchema, updateDeliverableStatusSchema } from "../validation/deliverableSchemas";
import { create, list, updateStatus } from "../controllers/deliverableController";

const router = Router({ mergeParams: true });

router.post("/", requireRole("ADMIN"), validate(createDeliverableSchema), create);
router.get("/", list);
router.patch("/:id", requireRole("ADMIN"), validate(updateDeliverableStatusSchema), updateStatus);

export default router;
