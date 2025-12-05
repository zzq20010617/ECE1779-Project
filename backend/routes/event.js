import express from "express";
import pool from "../db.js";
import { authenticate, authorize } from "../authMiddleware.js";

const router = express.Router();

// GET /events/count - Retrieve total event count
router.get("/count", async (req, res) => {
	try {
		const result = await pool.query("SELECT COUNT(*) FROM events");
		res.status(200).json({ count: parseInt(result.rows[0].count, 10) });
	} catch (err) {
		console.error("Error counting events:", err);
		res.status(500).json({ error: "Server error" });
	}
});

// POST /events - Create a new event
router.post("/", authenticate, authorize("admin", "organizer"), async (req, res) => {
	const { organizer_id, title, status, description, location, date, capacity } = req.body;
	try {
		if (!organizer_id || !title || !status || !location || !date || !capacity) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		const result = await pool.query(
			`INSERT INTO events (organizer_id, title, status, description, location, date, capacity)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, organizer_id, title, status, location, date, capacity`,
			[organizer_id, title, status, description || "", location, date, capacity]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error("Error creating event:", err);
		res.status(500).json({ error: "Server error" });
	}
});


// GET /events/search?query=keyword
router.get("/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing search query" });
  }
  console.log(query);
  try {
    const result = await pool.query(
      `SELECT * FROM events 
       WHERE title ILIKE $1 
          OR description ILIKE $1
       ORDER BY id ASC`,
      [`%${query}%`]
    );

	console.log(query)
    res.json(result.rows);
  } catch (err) {
    console.error("Error searching events:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /events/:id - Retrieve an event by ID
router.get("/:id", async (req, res) => {
	const id = parseInt(req.params.id, 10);
	try {
		const result = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Event not found" });
		}
		res.status(200).json(result.rows[0]);
	} catch (err) {
		console.error("Error fetching event:", err);
		res.status(500).json({ error: "Server error" });
	}
});

// PUT /events/:id - Update an event by ID (partial update)
router.put("/:id", authenticate, authorize("admin", "organizer"), async (req, res) => {
	const id = parseInt(req.params.id, 10);
	const fields = ["organizer_id", "title", "status", "description", "location", "date", "capacity"];
	const updates = [];
	const values = [];

	fields.forEach((field) => {
		if (req.body[field] !== undefined) {
			updates.push(`${field} = $${values.length + 1}`);
			values.push(req.body[field]);
		}
	});

	if (updates.length === 0) {
		return res.status(400).json({ error: "No fields to update" });
	}

	values.push(id);

	try {
		const result = await pool.query(
			`UPDATE events SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`,
			values
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Event not found" });
		}
		res.status(200).json(result.rows[0]);
	} catch (err) {
		console.error("Error updating event:", err);
		res.status(500).json({ error: "Server error" });
	}
});

// DELETE /events/:id - Delete an event by ID
router.delete("/:id", async (req, res) => {
	const id = parseInt(req.params.id, 10);
	try {
		const result = await pool.query("DELETE FROM events WHERE id = $1 RETURNING id", [id]);
		if (result.rowCount === 0) {
			return res.status(404).json({ error: "Event not found" });
		}
		res.status(200).json({ message: "Event deleted", id: result.rows[0].id });
	} catch (err) {
		console.error("Error deleting event:", err);
		res.status(500).json({ error: "Server error" });
	}
});

// GET /events - Retrieve all events
router.get("/", async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM events ORDER BY id ASC");
		res.json(result.rows);
	} catch (err) {
		console.error("Error fetching events:", err);
		res.status(500).json({ error: "Server error" });
	}
});

export default router;
