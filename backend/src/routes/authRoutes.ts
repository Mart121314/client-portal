import { Router } from "express";
import { register, login, me, logout, forgotPassword, resetPasswordHandler } from "../controllers/authController";
import { requireAuth } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validation/authSchemas";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", requireAuth, me);
router.post("/logout", requireAuth, logout);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPasswordHandler);

export default router;
