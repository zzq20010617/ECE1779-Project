import express from "express";
import pool from "../db.js";
import transporter from "../mailer.js";

const router = express.Router();

// Allowed status values
const VALID_STATUSES = ["registered", "canceled"];

// GET /registrations/count - Retrieve total registration count
router.get("/count", async (req, res) => {
	try {
		const result = await pool.query("SELECT COUNT(*) FROM registrations");
		res.status(200).json({ count: parseInt(result.rows[0].count, 10) });
	} catch (err) {
		console.error("Error counting registrations:", err);
		res.status(500).json({ error: "Server error" });
	}
});

// POST /registrations - Create a new registration
router.post("/", async (req, res) => {
	const { user_id, event_id, status } = req.body;

	try {
		if (!user_id || !event_id || !status) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		if (!VALID_STATUSES.includes(status)) {
			return res.status(400).json({ error: "Invalid status value" });
		}

		const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [user_id]);
		if (userCheck.rows.length === 0) {
			return res.status(400).json({ error: "Invalid user_id" });
		}

		const eventCheck = await pool.query("SELECT id FROM events WHERE id = $1", [event_id]);
		if (eventCheck.rows.length === 0) {
			return res.status(400).json({ error: "Invalid event_id" });
		}

		const existing = await pool.query(
			"SELECT id FROM registrations WHERE user_id = $1 AND event_id = $2",
			[user_id, event_id]
		);
		if (existing.rows.length > 0) {
			// Update existing registration to registered
			await pool.query(
				"UPDATE registrations SET status = 'registered' WHERE user_id = $1 AND event_id = $2",
				[user_id, event_id]
			);

			return res.json({ message: "Updated existing registration" });
		}

		const result = await pool.query(
			`INSERT INTO registrations (user_id, event_id, status)
             VALUES ($1, $2, $3)
             RETURNING id, user_id, event_id, status, timestamp`,
			[user_id, event_id, status]
		);

		const user = await pool.query("SELECT email, name FROM users WHERE id = $1", [user_id]);
		const event = await pool.query("SELECT title, date FROM events WHERE id = $1", [event_id]);

		const sender = {
			address: "university.event@ece1779.com",
			name: "ECE1779 University Event Management System",
		};

		const mailOptions = {
			from: sender,
			to: user.rows[0].email,
			subject: `Registration confirmed for ${event.rows[0].title}`,
			text: `Hi ${user.rows[0].name},\n\nYou are successfully registered for "${event.rows[0].title}" on ${event.rows[0].date}.\n\nSee you there!`,
		};

		await transporter.sendMail(mailOptions);

		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error("Error creating registration:", err);
		res.status(500).json({ error: "Server error" });
	}
});

// GET /registrations/:id - Retrieve a registration by ID
router.get("/:id", async (req, res) => {
	const id = parseInt(req.params.id, 10);
	try {
		const result = await pool.query(
			"SELECT id, user_id, event_id, status, timestamp FROM registrations WHERE id = $1",
			[id]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Registration not found" });
		}
		res.status(200).json(result.rows[0]);
	} catch (err) {
		console.error("Error fetching registration:", err);
		res.status(500).json({ error: "Server error" });
	}
});

// GET /registrations/user/:userId - Retrieve all registrations for a given user
router.get("/user/:userId", async (req, res) => {
	const userId = parseInt(req.params.userId, 10);
	const includePast = req.query.includePast !== "false";

	try {
		let query = `
      SELECT r.id, r.user_id, r.event_id, r.status, r.timestamp
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      WHERE r.user_id = $1
    `;
		const values = [userId];

		if (!includePast) {
			query += " AND e.date >= NOW()"; // only upcoming events
		}

		query += " ORDER BY r.timestamp DESC";

		const result = await pool.query(query, values);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "No registrations found for this user" });
		}

		res.status(200).json(result.rows);
	} catch (err) {
		console.error("Error fetching user registrations:", err);
		res.status(500).json({ error: "Server error" });
	}
});

// GET /registrations/event/:eventId - Retrieve all registrations for a given event
router.get("/event/:eventId", async (req, res) => {
	const eventId = parseInt(req.params.eventId, 10);
	try {
		const result = await pool.query(
			"SELECT id, user_id, event_id, status, timestamp FROM registrations WHERE event_id = $1 ORDER BY timestamp DESC",
			[eventId]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "No registrations found for this event" });
		}
		res.status(200).json(result.rows);
	} catch (err) {
		console.error("Error fetching event registrations:", err);
		res.status(500).json({ error: "Server error" });
	}
});

// PUT /registrations/:id - Update a registration by ID (partial update)
router.put("/:id", async (req, res) => {
	const id = parseInt(req.params.id, 10);
	const fields = ["user_id", "event_id", "status"];
	const updates = [];
	const values = [];

	fields.forEach((field) => {
		if (req.body[field] !== undefined) {
			if (field === "status" && !VALID_STATUSES.includes(req.body[field])) {
				return res.status(400).json({ error: "Invalid status value" });
			}
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
			`UPDATE registrations SET ${updates.join(", ")} WHERE id = $${values.length}
       RETURNING id, user_id, event_id, status, timestamp`,
			values
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Registration not found" });
		}

		const updated = result.rows[0];

		const user = await pool.query("SELECT email, name FROM users WHERE id = $1", [updated.user_id]);
		const event = await pool.query("SELECT title, date FROM events WHERE id = $1", [updated.event_id]);

		const sender = {
			address: "university.event@ece1779.com",
			name: "ECE1779 University Event Management System",
		};

		const mailOptions = {
			from: sender,
			to: user.rows[0].email,
			subject: `Your registration for ${event.rows[0].title} was updated`,
			text: `Hi ${user.rows[0].name},\n\nYour registration status for "${event.rows[0].title}" on ${event.rows[0].date} has been updated to "${updated.status}".\n\nThank you!`,
		};

		await transporter.sendMail(mailOptions);

		res.status(200).json(updated);
	} catch (err) {
		console.error("Error updating registration:", err);
		res.status(500).json({ error: "Server error" });
	}
});

// DELETE /registrations/:id - Delete a registration by ID
router.delete("/:id", async (req, res) => {
	const id = parseInt(req.params.id, 10);
	try {
		const result = await pool.query(
			"DELETE FROM registrations WHERE id = $1 RETURNING id, user_id, event_id",
			[id]
		);
		if (result.rowCount === 0) {
			return res.status(404).json({ error: "Registration not found" });
		}

		const deleted = result.rows[0];

		const user = await pool.query("SELECT email, name FROM users WHERE id = $1", [deleted.user_id]);
		const event = await pool.query("SELECT title, date FROM events WHERE id = $1", [deleted.event_id]);

		const sender = {
			address: "university.event@ece1779.com",
			name: "ECE1779 University Event Management System",
		};

		const mailOptions = {
			from: sender,
			to: user.rows[0].email,
			subject: `Your registration for ${event.rows[0].title} was deleted`,
			text: `Hi ${user.rows[0].name},\n\nYour registration for "${event.rows[0].title}" on ${event.rows[0].date} has been deleted.\n\nIf this was a mistake, please register again.\n\nThank you!`,
		};

		await transporter.sendMail(mailOptions);

		res.status(200).json({ message: "Registration deleted", id: deleted.id });
	} catch (err) {
		console.error("Error deleting registration:", err);
		res.status(500).json({ error: "Server error" });
	}
});

// GET /registrations - Retrieve all registrations
router.get("/", async (req, res) => {
	const includePast = req.query.includePast !== "false";
	try {
		let query = `
      SELECT r.id, r.user_id, r.event_id, r.status, r.timestamp
      FROM registrations r
      JOIN events e ON r.event_id = e.id
    `;
		if (!includePast) {
			query += " WHERE e.date >= NOW()";
		}
		query += " ORDER BY r.id ASC";

		const result = await pool.query(query);
		res.json(result.rows);
	} catch (err) {
		console.error("Error fetching registrations:", err);
		res.status(500).json({ error: "Server error" });
	}
});


// POST /registrations/check - Check if exist a registration by user and event id
router.post("/check", async (req, res) => {
	try {
		const { user_id, event_id } = req.body;
		const result = await pool.query("SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2",
			[user_id, event_id]);
		res.json(result.rows);
	} catch (err) {
		console.error("Error fetching registrations:", err);
		res.status(500).json({ error: "Server error" });
	}
});

// Get /registrations/capacity/:event_id - Check number of people register for this event
router.get("/capacity/:event_id", async (req, res) => {
	try {
		const event_id = parseInt(req.params.event_id, 10);
		const result = await pool.query("SELECT count(*) FROM registrations WHERE event_id = $1 AND status = 'registered'",
			[event_id]);
		res.json({ registered: Number(result.rows[0].count) });
	} catch (err) {
		console.error("Error getting capacity registrations:", err);
		res.status(500).json({ error: "Server error" });
	}
});

export default router;
