import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Alert,
  Box,
} from "@mui/material";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState("");
  const backendBase = `${process.env.REACT_APP_BE_URL}/api/events/${id}`;

  useEffect(() => {
    fetch(backendBase)
      .then((res) => res.json())
      .then(setEventData)
      .catch(() => setError("Failed to load event data"));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(backendBase, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Update failed");
        return;
      }

      navigate(`/events/${id}`);
    } catch (err) {
      setError("Could not reach backend");
    }
  };

  if (!eventData) return <div>Loading...</div>;

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Edit Event
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleUpdate} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
          />

          <TextField
            fullWidth
            select
            margin="normal"
            label="Status"
            value={eventData.status}
            onChange={(e) => setEventData({ ...eventData, status: e.target.value })}
          >
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </TextField>

          <TextField
            fullWidth
            margin="normal"
            label="Location"
            value={eventData.location}
            onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
          />

          <TextField
            fullWidth
            type="datetime-local"
            margin="normal"
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={eventData.date?.slice(0, 16)}
            onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Capacity"
            type="number"
            value={eventData.capacity}
            onChange={(e) => setEventData({ ...eventData, capacity: e.target.value })}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Description"
            multiline
            rows={3}
            value={eventData.description}
            onChange={(e) =>
              setEventData({ ...eventData, description: e.target.value })
            }
          />

          <Button fullWidth variant="contained" sx={{ mt: 3 }} type="submit">
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default EditEvent;
