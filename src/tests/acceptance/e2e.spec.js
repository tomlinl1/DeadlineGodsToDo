import { test, expect } from "@playwright/test";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import { startServer } from "../../server.js";
import Achievement from "../../models/Achievement.js";
import User from "../../models/User.js";

let mongoServer;
let server;
let baseURL;

test.beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri("playwright");

  const started = await startServer({ port: 0 });
  server = started.server;

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 5500;
  baseURL = `http://127.0.0.1:${port}`;

  // Seed minimal achievements so the "newlyUnlocked" toast can show text.
  await Achievement.create([
    { id: "ach_01", name: "FirstTask", description: "Complete 1 task", category: "tasks", points: 10 },
    { id: "ach_02", name: "FiveTasks", description: "Complete 5 tasks", category: "tasks", points: 25 },
  ]);
});

test.afterAll(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
  delete process.env.MONGO_URI;
});

test("acceptance: login -> create task -> list -> complete -> customize theme -> calendar add task", async ({ page }) => {
  // Login page
  await page.goto(`${baseURL}/login`);
  await page.locator("#usernameInput").fill("alice");
  await page.locator("#loginBtn").click();
  await page.waitForURL(`${baseURL}/`);

  // Create a task from home write page
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const dateStr = `${yyyy}-${mm}-${dd}`;

  await page.locator('input[name="title"]').fill("E2E Task 1");
  await page.locator('input[name="date"]').fill(dateStr);
  await page.locator('select[name="priority"]').selectOption("low");
  await page.locator('input[name="tags"]').fill("school, e2e");
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(`${baseURL}/`);

  // Verify it shows in list
  await page.goto(`${baseURL}/list`);
  await expect(page.getByText("E2E Task 1")).toBeVisible();

  // Complete the task (first completion should unlock ach_01 and show toast text)
  const row = page.locator('li.list-group-item', { hasText: "E2E Task 1" });
  await row.locator("button.complete").click();
  await expect(row.locator("button.complete")).toBeDisabled();
  await expect(page.locator("#achievementToastMsg")).toContainText("Achievement unlocked");

  // Make sure dark theme is unlocked for the user, then apply it in Customize UI.
  await User.updateOne(
    { user_id: "alice" },
    { $set: { "customization.unlockedThemes": ["default", "dark"] } }
  );

  await page.goto(`${baseURL}/customize`);
  const themeSelect = page.locator("#themeSelect");
  await expect(themeSelect).toBeVisible();
  await themeSelect.selectOption("dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  // Calendar: add another task using the modal and confirm it appears in list after.
  await page.goto(`${baseURL}/calendar`);
  await page.locator("#add-task-btn").click();

  // Modal form fields are named the same as the home write form.
  await page.locator('#addTaskModal input[name="title"]').fill("E2E Task 2");
  await page.locator('#addTaskModal input[name="date"]').fill(dateStr);
  await page.locator('#addTaskModal button[type="submit"]').click();

  await page.goto(`${baseURL}/list`);
  await expect(page.getByText("E2E Task 2")).toBeVisible();
});

