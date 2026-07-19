import { Router } from "express";
import { requireRole } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { createInvoiceSchema, updateInvoiceStatusSchema } from "../validation/invoiceSchemas";
import { create, list, updateStatus } from "../controllers/invoiceController";

const router = Router({ mergeParams: true });

router.post("/", requireRole("ADMIN"), validate(createInvoiceSchema), create);
router.get("/", list);
router.patch("/:id", requireRole("ADMIN"), validate(updateInvoiceStatusSchema), updateStatus);

export default router;
