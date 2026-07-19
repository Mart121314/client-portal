import express from "express";
import cors from "cors";
import helmet from "helmet";
import { prisma } from "./database/prisma";
import authRoutes from "./routes/authRoutes";
import serviceRequestRoutes from "./routes/serviceRequestRoutes";
import fileUploadRoutes from "./routes/fileUploadRoutes";
import messageRoutes from "./routes/messageRoutes";
import deliverableRoutes from "./routes/deliverableRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import userRoutes from "./routes/userRoutes";
import projectRoutes from "./routes/projectRoutes";
import { requireAuth } from "./middleware/authMiddleware";
import { requireProjectAccess } from "./middleware/projectAccessMiddleware";
import { generalLimiter, authLimiter } from "./middleware/rateLimiter";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(generalLimiter);

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects/:projectId/files", requireAuth, requireProjectAccess, fileUploadRoutes);
app.use("/api/projects/:projectId/messages", requireAuth, requireProjectAccess, messageRoutes);
app.use("/api/projects/:projectId/deliverables", requireAuth, requireProjectAccess, deliverableRoutes);
app.use("/api/projects/:projectId/invoices", requireAuth, requireProjectAccess, invoiceRoutes);

app.get("/health", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: "ok" });
});

app.use(notFoundHandler);
app.use(errorHandler);
