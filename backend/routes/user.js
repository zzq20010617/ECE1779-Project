import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET /users - Retrieve all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, role FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;