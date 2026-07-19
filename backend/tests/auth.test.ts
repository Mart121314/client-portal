import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/database/prisma";

const domain = "@auth.apitest.local";

describe("auth flow", () => {
  const email = `user1${domain}`;
  const password = "secret123";

  it("rejects registration with an invalid email", async () => {
    const res = await request(app).post("/api/auth/register").send({ email: "not-an-email", password: "short" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validering mislyktes");
  });

  it("registers a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({ email, password });
    expect(res.status).toBe(201);
    expect(res.body.email).toBe(email);
    expect(res.body.role).toBe("CLIENT");
  });

  it("rejects duplicate registration", async () => {
    const res = await request(app).post("/api/auth/register").send({ email, password });
    expect(res.status).toBe(400);
  });

  it("rejects login with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({ email, password: "wrongpass" });
    expect(res.status).toBe(401);
  });

  it("logs in with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rejects /me without a token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("returns the current user from /me with a valid token", async () => {
    const login = await request(app).post("/api/auth/login").send({ email, password });
    const token = login.body.token;

    const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(email);
  });

  it("supports the full forgot-password / reset-password flow", async () => {
    const forgot = await request(app).post("/api/auth/forgot-password").send({ email });
    expect(forgot.status).toBe(200);
    expect(forgot.body.resetToken).toBeDefined();

    const newPassword = "brandnewpass123";
    const reset = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: forgot.body.resetToken, newPassword });
    expect(reset.status).toBe(200);

    const loginOld = await request(app).post("/api/auth/login").send({ email, password });
    expect(loginOld.status).toBe(401);

    const loginNew = await request(app).post("/api/auth/login").send({ email, password: newPassword });
    expect(loginNew.status).toBe(200);
  });

  it("revokes the token on logout", async () => {
    const login = await request(app).post("/api/auth/login").send({ email, password: "brandnewpass123" });
    const token = login.body.token;

    const logout = await request(app).post("/api/auth/logout").set("Authorization", `Bearer ${token}`);
    expect(logout.status).toBe(200);

    const afterLogout = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);
    expect(afterLogout.status).toBe(401);
  });

  afterAll(async () => {
    const users = await prisma.user.findMany({ where: { email: { contains: domain } } });
    await prisma.user.deleteMany({ where: { id: { in: users.map((u) => u.id) } } });
  });
});
