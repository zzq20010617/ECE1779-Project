import express from "express";
import eventsRouter from "./routes/event.js";
import usersRouter from "./routes/user.js";
import registrationRouter from "./routes/registration.js";
import cors from "cors";

const app = express();
const port = process.env.BE_PORT || 4000;  

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "School Event Management API is running",
  });
});

app.use("/api/events", eventsRouter);
app.use("/api/users", usersRouter);
app.use("/api/registrations", registrationRouter);


app.get("/", (req, res) => {
  res.send("School Event Management API is running");
});
app.get("/api/health", (req, res) => {
  res.send("OK from backend");
});

// Start the server
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
