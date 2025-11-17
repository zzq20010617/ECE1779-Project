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

console.log(localStorage.getItem("currentUser"))
const backend = `http://localhost:${process.env.REACT_APP_BE_PORT}`
function EventsPage() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    const eventapi = backend+"/api/events"
    fetch(eventapi)
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setStatus("");
      })
      .catch(err => {
        setStatus("Failed to fetch events");
      });
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* Banner / Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          All Events
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/registrations")}
        >
          My Events
        </Button>
      </Box>

      {/* List of events */}
      <List>
        {events.map((event, index) => (
          <>
            <ListItem disablePadding key={event.id}>
              <ListItemButton onClick={() => navigate(`/events/${event.id}`)}>
                <ListItemText
                  primary={event.title}
                  secondary={new Date(event.date).toLocaleDateString()}
                />
              </ListItemButton>
            </ListItem>

            {index < events.length - 1 && <Divider />}
          </>
        ))}
      </List>
    </Container>
  );
}

export default EventsPage;
