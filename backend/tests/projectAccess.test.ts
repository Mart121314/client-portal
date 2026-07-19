import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/database/prisma";

const domain = "@access.apitest.local";

describe("project-scoped resources", () => {
  const clientAEmail = `clienta${domain}`;
  const clientBEmail = `clientb${domain}`;
  const password = "secret123";

  let clientAToken: string;
  let clientBToken: string;
  let adminToken: string;
  let projectId: string;

  beforeAll(async () => {
    await request(app).post("/api/auth/register").send({ email: clientAEmail, password });
    await request(app).post("/api/auth/register").send({ email: clientBEmail, password });

    const loginA = await request(app).post("/api/auth/login").send({ email: clientAEmail, password });
    clientAToken = loginA.body.token;

    const loginB = await request(app).post("/api/auth/login").send({ email: clientBEmail, password });
    clientBToken = loginB.body.token;

    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
    adminToken = adminLogin.body.token;

    const sr = await request(app)
      .post("/api/service-requests")
      .set("Authorization", `Bearer ${clientAToken}`)
      .send({ description: "Bathroom remodel" });

    const project = await request(app)
      .patch(`/api/service-requests/${sr.body.id}/approve`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Bathroom Project" });

    projectId = project.body.id;
  });

  it("lets the owning client upload a file", async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/files`)
      .set("Authorization", `Bearer ${clientAToken}`)
      .send({ filename: "plan.pdf", url: "https://example.com/plan.pdf", mimeType: "application/pdf", size: 1000 });

    expect(res.status).toBe(201);
  });

  it("lets the owning client post a message", async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/messages`)
      .set("Authorization", `Bearer ${clientAToken}`)
      .send({ content: "Looking forward to this!" });

    expect(res.status).toBe(201);
  });

  it("blocks a client from creating a deliverable", async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/deliverables`)
      .set("Authorization", `Bearer ${clientAToken}`)
      .send({ title: "Demo" });

    expect(res.status).toBe(403);
  });

  it("lets an admin create and mark a deliverable DELIVERED", async () => {
    const created = await request(app)
      .post(`/api/projects/${projectId}/deliverables`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Demo" });
    expect(created.status).toBe(201);

    const updated = await request(app)
      .patch(`/api/projects/${projectId}/deliverables/${created.body.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "DELIVERED" });

    expect(updated.status).toBe(200);
    expect(updated.body.status).toBe("DELIVERED");
  });

  it("lets an admin create and mark an invoice PAID", async () => {
    const created = await request(app)
      .post(`/api/projects/${projectId}/invoices`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: 500 });
    expect(created.status).toBe(201);

    const updated = await request(app)
      .patch(`/api/projects/${projectId}/invoices/${created.body.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "PAID" });

    expect(updated.status).toBe(200);
    expect(updated.body.status).toBe("PAID");
  });

  it("blocks a different client from accessing the project", async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}/messages`)
      .set("Authorization", `Bearer ${clientBToken}`);

    expect(res.status).toBe(403);
  });

  afterAll(async () => {
    const users = await prisma.user.findMany({ where: { email: { contains: domain } } });
    const userIds = users.map((u) => u.id);

    await prisma.invoice.deleteMany({ where: { projectId } });
    await prisma.deliverable.deleteMany({ where: { projectId } });
    await prisma.message.deleteMany({ where: { projectId } });
    await prisma.fileUpload.deleteMany({ where: { projectId } });
    await prisma.project.deleteMany({ where: { id: projectId } });
    await prisma.serviceRequest.deleteMany({ where: { clientId: { in: userIds } } });
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  });
});
