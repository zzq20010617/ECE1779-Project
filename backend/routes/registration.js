import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET /registrations - Retrieve all registrations
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM registrations ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching registrations:", err);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
