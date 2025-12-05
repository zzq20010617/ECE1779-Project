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
import {jwtDecode} from "jwt-decode";

const backend = process.env.REACT_APP_BE_URL

function MyEventsPage() {

  const token = localStorage.getItem("token");
  let currentUser = null;
  if (token) {
    currentUser = jwtDecode(token);
  }
  const userId = currentUser?.id;
  
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    const eventapi = `${backend}/api/users/${userId}/events`
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
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Registered Events
        </Typography>
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

export default MyEventsPage;