import express from "express";
import eventsRouter from "./routes/event.js";
import usersRouter from "./routes/user.js";
import registrationRouter from "./routes/registration.js"

import cors from "cors";

const app = express();
const port = process.env.BE_PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Apply routers
app.use("/events", eventsRouter);
app.use("/users", usersRouter);
app.use("/registrations", registrationRouter);

// Default route
app.get("/", (req, res) => {
  res.send("School Event Management API is running");
});

// Start the server
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
