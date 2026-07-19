import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/database/prisma";

const domain = "@sr.apitest.local";

describe("service request -> project flow", () => {
  const clientEmail = `client${domain}`;
  const password = "secret123";
  let clientToken: string;
  let adminToken: string;

  beforeAll(async () => {
    await request(app).post("/api/auth/register").send({ email: clientEmail, password });
    const clientLogin = await request(app).post("/api/auth/login").send({ email: clientEmail, password });
    clientToken = clientLogin.body.token;

    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
    adminToken = adminLogin.body.token;
  });

  it("lets a client create a service request", async () => {
    const res = await request(app)
      .post("/api/service-requests")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({ description: "Need a fence built" });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("PENDING");
  });

  it("blocks a client from approving their own request", async () => {
    const created = await request(app)
      .post("/api/service-requests")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({ description: "Need a deck built" });

    const res = await request(app)
      .patch(`/api/service-requests/${created.body.id}/approve`)
      .set("Authorization", `Bearer ${clientToken}`)
      .send({ title: "Deck Project" });

    expect(res.status).toBe(403);
  });

  it("lets an admin approve a request into a project", async () => {
    const created = await request(app)
      .post("/api/service-requests")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({ description: "Need a shed built" });

    const res = await request(app)
      .patch(`/api/service-requests/${created.body.id}/approve`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Shed Project" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ACTIVE");
    expect(res.body.serviceRequestId).toBe(created.body.id);
  });

  afterAll(async () => {
    const users = await prisma.user.findMany({ where: { email: { contains: domain } } });
    const userIds = users.map((u) => u.id);
    const projects = await prisma.project.findMany({ where: { clientId: { in: userIds } } });
    const projectIds = projects.map((p) => p.id);

    await prisma.project.deleteMany({ where: { id: { in: projectIds } } });
    await prisma.serviceRequest.deleteMany({ where: { clientId: { in: userIds } } });
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  });
});
