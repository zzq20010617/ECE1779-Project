import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
  Container,
} from "@mui/material";

const backend = process.env.REACT_APP_BE_URL;

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("Loading...");
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const canManageEvents =
    currentUser &&
    (currentUser.role === "organizer" || currentUser.role === "admin");

  useEffect(() => {
    const eventapi = backend + "/api/events";
    fetch(eventapi)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setStatus("");
      })
      .catch((err) => {
        console.error(err);
        setStatus("Failed to fetch events");
      });
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          All Events
        </Typography>

        {canManageEvents && (
          <Button
            variant="contained"
            onClick={() => navigate("/events/create")}
          >
            Create Event
          </Button>
        )}
      </Box>

      {status && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {status}
        </Typography>
      )}

      <List>
        {events.map((event, index) => (
          <Box key={event.id}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate(`/events/${event.id}`)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={new Date(event.date).toLocaleDateString()}
                />

                {canManageEvents && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // 防止触发外层 onClick
                      navigate(`/events/${event.id}/edit`);
                    }}
                  >
                    Edit
                  </Button>
                )}
              </ListItemButton>
            </ListItem>

            {index < events.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    </Container>
  );
}

export default EventsPage;
