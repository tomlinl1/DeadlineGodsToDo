import request from "supertest";

import { createApp } from "../../app.js";
import { connectInMemoryMongo, disconnectInMemoryMongo, resetDatabase } from "../helpers/mongoMemory.js";

import User from "../../models/User.js";
import Post from "../../models/Post.js";
import Achievement from "../../models/Achievement.js";

describe("integration: routes + mongoose", () => {
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

  test("POST /api/login creates a new user and seeds achievements", async () => {
    await Achievement.create([
      { id: "ach_01", name: "FirstTask", description: "Complete 1 task", category: "tasks", points: 10 },
      { id: "ach_02", name: "FiveTasks", description: "Complete 5 tasks", category: "tasks", points: 25 },
    ]);

    const res = await request(app).post("/api/login").send({ user_id: "alice" });
    expect(res.status).toBe(200);
    expect(res.body.user_id).toBe("alice");
    expect(Array.isArray(res.body.achievements)).toBe(true);
    expect(res.body.achievements.length).toBe(2);
  });

  test("GET /api/users requires user_id and returns 400 if missing", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(400);
  });

  test("PATCH /api/users/:userId/customization/theme blocks locked themes", async () => {
    await User.create({
      user_id: "alice",
      customization: { activeTheme: "default", unlockedThemes: ["default"] },
    });

    const locked = await request(app)
      .patch("/api/users/alice/customization/theme")
      .send({ theme: "dark" });
    expect(locked.status).toBe(403);

    await User.updateOne({ user_id: "alice" }, { $set: { "customization.unlockedThemes": ["default", "dark"] } });
    const unlocked = await request(app)
      .patch("/api/users/alice/customization/theme")
      .send({ theme: "dark" });
    expect(unlocked.status).toBe(200);
    expect(unlocked.body.activeTheme).toBe("dark");
  });

  test("POST /complete/:id marks task completed and is idempotent (2nd call is 400)", async () => {
    await Achievement.create([
      { id: "ach_01", name: "FirstTask", description: "Complete 1 task", category: "tasks", points: 10 },
    ]);

    await User.create({
      user_id: "alice",
      achievements: [],
      total_points: 0,
      total_tasks: 0,
      total_tasks_low: 0,
      total_tasks_medium: 0,
      total_tasks_high: 0,
      customization: { activeTheme: "default", unlockedThemes: ["default"] },
    });

    await Post.create({
      _id: 1,
      title: "Do homework",
      username: "alice",
      date: new Date(),
      priority: "low",
      tags: ["school"],
      completed: false,
    });

    const first = await request(app).post("/complete/1").send({ username: "alice" });
    expect(first.status).toBe(200);
    expect(first.body.success).toBe(true);

    const updatedUser = await User.findOne({ user_id: "alice" });
    expect(updatedUser.total_tasks).toBe(1);
    expect(updatedUser.total_tasks_low).toBe(1);
    expect(updatedUser.total_points).toBeGreaterThanOrEqual(10);

    const second = await request(app).post("/complete/1").send({ username: "alice" });
    expect(second.status).toBe(400);
  });

  test("GET /list renders HTML containing seeded task titles", async () => {
    await Post.create([
      { _id: 1, title: "TaskA", username: "alice", date: new Date(), priority: "high", tags: [], completed: false },
      { _id: 2, title: "TaskB", username: "alice", date: new Date(), priority: "low", tags: ["x"], completed: false },
    ]);

    const res = await request(app).get("/list?username=alice");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/text\/html/);
    expect(res.text).toContain("TaskA");
    expect(res.text).toContain("TaskB");
  });
});

