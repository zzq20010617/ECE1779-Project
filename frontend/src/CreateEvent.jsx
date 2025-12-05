import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  MenuItem,
  Box,
} from "@mui/material";
import {jwtDecode} from "jwt-decode";

function CreateEvent() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("open");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const backendBase = `${process.env.REACT_APP_BE_URL}/api/events`;

  const token = localStorage.getItem("token");
  let currentUser = null;
  if (token) {
    currentUser = jwtDecode(token);
  }
  const organizerId = currentUser?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!organizerId) {
      setError("Only organizers can create events.");
      return;
    }

    try {
      const res = await fetch(backendBase, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
         },
        body: JSON.stringify({
          organizer_id: organizerId,
          title,
          status,
          description,
          location,
          date,
          capacity: parseInt(capacity, 10),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create event");
        return;
      }

      setSuccess("Event created successfully!");
      setTimeout(() => navigate("/events"), 1500);
    } catch (err) {
      setError("Could not reach backend");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Create New Event
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Title"
            margin="normal"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            fullWidth
            select
            label="Status"
            margin="normal"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Location"
            margin="normal"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <TextField
            fullWidth
            label="Date"
            type="datetime-local"
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <TextField
            fullWidth
            label="Capacity"
            margin="normal"
            type="number"
            required
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />

          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            type="submit"
          >
            Create Event
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default CreateEvent;
