import { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client";

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: "Ikke funnet" });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "En oppføring med denne verdien finnes allerede" });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Oppføring ikke funnet" });
    }
  }

  res.status(500).json({ error: "Intern serverfeil" });
}
