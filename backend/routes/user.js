import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET /users/count - Retrieve total user count
router.get("/count", async (req, res) => {
	try {
		const result = await pool.query("SELECT COUNT(*) FROM users");
		res.status(200).json({ count: parseInt(result.rows[0].count, 10) });
	} catch (err) {
		console.error("Error counting users:", err);
		res.status(500).json({ error: "Server error" });
	}
});

// POST /users - Create a new user
router.post("/", async (req, res) => {
	const { name, email, password_hash, role } = req.body;
	try {
		if (!name || typeof name !== "string") {
			return res.status(400).json({ error: "Name is missing" });
		}
		if (!email || typeof email !== "string") {
			return res.status(400).json({ error: "Email is missing" });
		}
		if (!password_hash || typeof password_hash !== "string") {
			return res.status(400).json({ error: "Password is missing" });
		}
		if (!role || typeof role !== "string") {
			return res.status(400).json({ error: "Role is missing" });
		}

		const result = await pool.query(
			"INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
			[name, email, password_hash, role]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error("Error creating user:", err);
		res.status(500).json({ error: "Server error" });
	}
});

// GET /users/:id - Retrieve a user by ID
router.get("/:id", async (req, res) => {
	const id = parseInt(req.params.id, 10);
	try {
		const result = await pool.query("SELECT id, name, email, role FROM users WHERE id = $1", [id]);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "User not found" });
		}
		res.status(200).json(result.rows[0]);
	} catch (err) {
		console.error("Error fetching user:", err);
		res.status(500).json({ error: "Server error" });
	}
});

// PUT /users/:id - Update a user by ID (partial update)
router.put("/:id", async (req, res) => {
	const id = parseInt(req.params.id, 10);
	const fetch = await pool.query(
		"SELECT name FROM users WHERE id = $1",
		[id]
	);
	if (fetch.rows.length === 0) {
		return res.status(404).json({ error: "User not found" });
	}

	const fields = ["name", "email", "password_hash", "role"];
	const updates = [];
	const values = [];

	fields.forEach((field, index) => {
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
			`UPDATE users SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING id, name, email, role`,
			values
		);
		res.status(200).json(result.rows[0]);
	} catch (err) {
		console.error("Error updating user:", err);
		res.status(500).json({ error: "Server error" });
	}
});

// DELETE /users/:id - Delete a user by ID
router.delete("/:id", async (req, res) => {
	const id = parseInt(req.params.id, 10);
	try {
		const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
		if (result.rowCount === 0) {
			return res.status(404).json({ error: "User not found" });
		}
		res.status(200).json({ message: "User deleted", id: result.rows[0].id });
	} catch (err) {
		console.error("Error deleting user:", err);
		res.status(500).json({ error: "Server error" });
	}
});


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
