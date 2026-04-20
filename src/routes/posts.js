import { Router } from "express";
import Post from "../models/Post.js";
import { getNextId, parseTags } from "../util/util.js";

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

export default router;
