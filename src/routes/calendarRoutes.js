import express from "express";
const router = express.Router();
import CalendarTask from "../models/CalendarTask.js"; 


// GET /api/calendar/:user_id
router.get("/:user_id", async (req, res) => {
  const userId = parseInt(req.params.user_id);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid or missing user_id parameter" });
  }

    try {
        // Get tasks for user, sorted by priority (highest first)
        const tasks = await CalendarTask.find({ user_id: userId }).sort({ priority: -1 }); // sort by priority descending
        res.json(tasks);
        console.log("All tasks", await CalendarTask.countDocuments());
        console.log("Fetched tasks:", tasks);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;