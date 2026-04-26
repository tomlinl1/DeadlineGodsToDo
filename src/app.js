import express from "express";
import methodOverride from "method-override";

import userRoutes from "./routes/userRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import postRoutes from "./routes/posts.js";
import listRoutes from "./routes/list.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/public", express.static("public"));
  app.use(methodOverride("_method"));

  app.set("view engine", "ejs");

  // API routes
  app.use("/api/users", userRoutes);
  app.use("/api/achievements", achievementRoutes);
  app.use("/api/calendar", calendarRoutes);
  app.use("/api", loginRoutes);

  // Page routes
  app.use("/", postRoutes);
  app.use("/list", listRoutes);

  // Simple page renders (kept from previous index.js)
  app.get("/calendar", (req, res) => res.render("calendar.ejs"));
  app.get("/login", (req, res) => res.render("login"));
  app.get("/customize", (req, res) => res.render("customize"));

  return app;
}

