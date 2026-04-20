import express from "express";
const router = express.Router();
import User from "../models/User.js";

// GET /api/users?username=<username>
router.get("/", async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: "user_id required" });
  }

  try {
    const user = await User.findOne({ user_id: user_id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users
router.post("/", async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const existing = await User.findOne({ user_id });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      user_id,
      achievements: [],
      total_points: "0"
    });

    await newUser.save();
    res.status(201).json(newUser);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

//patch
router.patch("/:userId/customization/font", async (req, res) => {
  try {
    const { font } = req.body;

    const user = await User.findOneAndUpdate(
      { user_id: req.params.userId },
      { $set: { "customization.font": font } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;

