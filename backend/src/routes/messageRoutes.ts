import { Router } from "express";
import { validate } from "../middleware/validate";
import { createMessageSchema } from "../validation/messageSchemas";
import { create, list } from "../controllers/messageController";

const router = Router({ mergeParams: true });

router.post("/", validate(createMessageSchema), create);
router.get("/", list);

export default router;
