import { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
  Container,
} from "@mui/material";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    const backend =  "http://localhost:3000/events"
    fetch(backend)
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
      <Typography variant="h4" gutterBottom>
        All Events
      </Typography>
      <List>
        {events.map((event, index) => (
          <>
            <ListItem disablePadding key={event.id}>
              <ListItemButton>
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
