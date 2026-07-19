import { Router } from "express";
import { validate } from "../middleware/validate";
import { createFileUploadSchema } from "../validation/fileUploadSchemas";
import { create, list } from "../controllers/fileUploadController";

const router = Router({ mergeParams: true });

router.post("/", validate(createFileUploadSchema), create);
router.get("/", list);

export default router;
