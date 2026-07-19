import { Router } from "express";
import { requireRole } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { createMessageSchema } from "../validation/messageSchemas";
import { create, list, markRead } from "../controllers/messageController";

const router = Router({ mergeParams: true });

router.post("/", validate(createMessageSchema), create);
router.get("/", list);
router.patch("/read", requireRole("ADMIN"), markRead);

export default router;
