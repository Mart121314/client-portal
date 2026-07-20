import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { updateInvoiceStatusSchema } from "../validation/invoiceSchemas";
import { listAll, updateStatus } from "../controllers/invoiceController";

const router = Router();

router.get("/", requireAuth, requireRole("ADMIN"), listAll);
router.patch("/:id", requireAuth, requireRole("ADMIN"), validate(updateInvoiceStatusSchema), updateStatus);

export default router;
