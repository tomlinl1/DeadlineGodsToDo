import { Router } from "express";
import Post from "../models/Post.js";
import { getNextId, parseTags } from "../util/util.js";
import User from "../models/User.js";
import Achievement from "../models/Achievement.js";

const router = Router();

// GET / - Show write form
router.get("/", (req, res) => {
  res.render("write.ejs");
});

// POST /add - Create a new task (fixed)
router.post("/add", async (req, res) => {
  try {
    const dateStr = `${req.body.date}T00:00:00`; // treat as local midnight
    const newPost = new Post({
      _id: await getNextId(),
      title: req.body.title,
      username: req.body.username,
      date: new Date(dateStr),
      priority: req.body.priority || "medium",
      tags: parseTags(req.body.tags),
    });
    await newPost.save();
    res.redirect("/");
  } catch (e) {
    console.error("Error adding post:", e);
    res.status(500).send("Error adding post");
  }
});

// GET /detail/:id - Show task details
router.get("/detail/:id", async (req, res) => {
  try {
    const post = await Post.findById(parseInt(req.params.id));
    if (!post) return res.status(404).send("Post not found");
    res.render("detail.ejs", { data: post });
  } catch (e) {
    console.error("Error fetching post details:", e);
    res.status(500).send("Error fetching post details");
  }
});

// GET /edit/:id - Show edit form
router.get("/edit/:id", async (req, res) => {
  try {
    const post = await Post.findById(parseInt(req.params.id));
    if (!post) return res.status(404).send("Post not found");
    res.render("edit.ejs", { data: post });
  } catch (e) {
    console.error("Error fetching post for editing:", e);
    res.status(500).send("Error fetching post for editing");
  }
});

// PUT /edit - Update a task
router.put("/edit", async (req, res) => {
  //This does not work I want it to but cba to get it working
  const post = await Post.findById(parseInt(req.body.id));

  //if (!post) return res.status(404).send("Not found");

  // check ownership
  if (post.username !== req.body.username) {
    return res.status(403).send("Unauthorized");
  }
  try {
    const dateStr =
      req.body.time ?
        `${req.body.date}T${req.body.time}:00`
      : `${req.body.date}T00:00:00`;
    await Post.findByIdAndUpdate(parseInt(req.body.id), {
      title: req.body.title,
      date: new Date(dateStr),
      priority: req.body.priority || "medium",
      tags: parseTags(req.body.tags),
    });
    console.log("USERNAME FROM FORM:", req.body.username);
    res.redirect(`/list?username=${encodeURIComponent(req.body.username)}`);
  } catch (e) {
    console.error("Error updating post:", e);
    res.status(500).send("Error updating post");
  }
});

// DELETE /delete - Delete a task
router.delete("/delete", async (req, res) => {
  try {
    await Post.findByIdAndDelete(parseInt(req.body._id));
    res.send("Delete complete");
  } catch (e) {
    console.error("Error deleting post:", e);
    res.status(500).send("Error deleting post");
  }
});

// GET /listjson - Return filtered posts as JSON
router.get("/listjson", async (req, res) => {
  try {
    const { tag, priority, dateFrom, dateTo, search } = req.query;
    const query = {};

    if (tag) query.tags = tag;
    if (priority) query.priority = priority;
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        query.date.$lte = to;
      }
    }
    if (search) query.title = { $regex: search, $options: "i" };

    const posts = await Post.find(query).sort({ date: 1 });
    res.json(posts);
  } catch (e) {
    console.error("Error fetching posts JSON:", e);
    res.status(500).json({ error: "Error fetching posts" });
  }
});

// POST /complete/:id - Mark task complete, update counters, check achievements
router.post("/complete/:id", async (req, res) => {
  try {
    const post = await Post.findById(parseInt(req.params.id));
    if (!post) return res.status(404).json({ error: "Task not found" });
    if (post.completed) return res.status(400).json({ error: "Task already completed" });

    post.completed = true;
    await post.save();

    const priorityField = `total_tasks_${post.priority}`;

    const user = await User.findOneAndUpdate(
      { user_id: req.body.username },
      { $inc: { total_tasks: 1, [priorityField]: 1 } },
      { new: true } // return the updated user so we can check counters
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    // --- Achievement check ---
    const { total_tasks, total_tasks_low, total_tasks_medium, total_tasks_high } = user;

    const achievementTriggers = [
      { id: "ach_01", condition: total_tasks >= 1 },
      { id: "ach_02", condition: total_tasks >= 5 },
      { id: "ach_03", condition: total_tasks >= 10 },
      { id: "ach_04", condition: total_tasks_low >= 1 },
      { id: "ach_05", condition: total_tasks_low >= 5 },
      { id: "ach_06", condition: total_tasks_medium >= 1 },
      { id: "ach_07", condition: total_tasks_medium >= 5 },
      { id: "ach_08", condition: total_tasks_high >= 1 },
      { id: "ach_09", condition: total_tasks >= 100},
    ];

    const newlyUnlocked = [];

    for (const trigger of achievementTriggers) {
      if (!trigger.condition) continue;

      const userAch = user.achievements.find(ua => ua.achievement_ID === trigger.id);
      if (userAch?.completed) continue; // already unlocked, skip

      // Mark it complete
      if (userAch) {
        userAch.completed = true;
        userAch.completed_at = new Date();
      } else {
        user.achievements.push({
          achievement_ID: trigger.id,
          completed: true,
          completed_at: new Date()
        });
      }

      // Award points
      const achievement = await Achievement.findOne({ id: trigger.id });
      if (achievement) user.total_points += Number(achievement.points);

      // Unlock theme if applicable
      const themeUnlocks = {
        ach_01: "default", 
        ach_02: "dark", 
        ach_03: "ocean",
        ach_04: "porple",  
        ach_05: "discord", 
        ach_06: "mint"
      };
      const theme = themeUnlocks[trigger.id];
      if (theme && !user.customization.unlockedThemes.includes(theme)) {
        user.customization.unlockedThemes.push(theme);
      }

      newlyUnlocked.push(achievement.name);
    }

    await user.save();

    res.json({ success: true, newlyUnlocked });

  } catch (e) {
    console.error("Error completing task:", e);
    res.status(500).json({ error: "Error completing task" });
  }
});

export default router;
