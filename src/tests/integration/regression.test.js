import request from "supertest";

import { createApp } from "../../app.js";
import { connectInMemoryMongo, disconnectInMemoryMongo, resetDatabase } from "../helpers/mongoMemory.js";

import User from "../../models/User.js";
import Post from "../../models/Post.js";

describe("regression: critical invariants", () => {
  const app = createApp();

  beforeAll(async () => {
    await connectInMemoryMongo();
  });

  afterAll(async () => {
    await disconnectInMemoryMongo();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  test("theme lock cannot be bypassed (403 when locked)", async () => {
    await User.create({
      user_id: "alice",
      customization: { activeTheme: "default", unlockedThemes: ["default"] },
    });

    const res = await request(app)
      .patch("/api/users/alice/customization/theme")
      .send({ theme: "dark" });
    expect(res.status).toBe(403);
  });

  test("user lookup requires user_id (400)", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(400);
  });

  test("search is case-insensitive on /listjson?search=", async () => {
    await Post.create([
      { _id: 1, title: "Write Essay", username: "alice", date: new Date(), priority: "medium", tags: [], completed: false },
      { _id: 2, title: "buy milk", username: "alice", date: new Date(), priority: "low", tags: [], completed: false },
    ]);

    const res = await request(app).get("/listjson?search=ESSAY");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.map((p) => p.title)).toContain("Write Essay");
  });
});

