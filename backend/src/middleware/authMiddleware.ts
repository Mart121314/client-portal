import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../database/prisma";

export interface AuthRequest extends Request {
  userId?: string;
  role?: string;
  jti?: string;
  tokenExp?: number;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Ingen token oppgitt" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
      role: string;
      jti: string;
      exp: number;
    };

    const revoked = await prisma.revokedToken.findUnique({ where: { jti: payload.jti } });
    if (revoked) {
      return res.status(401).json({ error: "Token er tilbakekalt" });
    }

    req.userId = payload.sub;
    req.role = payload.role;
    req.jti = payload.jti;
    req.tokenExp = payload.exp;
    next();
  } catch {
    res.status(401).json({ error: "Ugyldig eller utløpt token" });
  }
}

export function requireRole(role: "ADMIN" | "CLIENT") {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.role !== role) {
      return res.status(403).json({ error: "Ingen tilgang" });
    }
    next();
  };
}
