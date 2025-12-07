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
  Paper,
  InputBase,
  IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {jwtDecode} from "jwt-decode";

const backend = process.env.REACT_APP_BE_URL;
const token = localStorage.getItem("token");

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("Loading...");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setCurrentUser(jwtDecode(token));
    } else {
      setCurrentUser(null);
    }
  }, []);

  const canManageEvents =
    currentUser &&
    (currentUser.role === "organizer" || currentUser.role === "admin");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchText.trim()) return;

    try {
      const res = await fetch(
        `${backend}/api/events/search?query=${encodeURIComponent(searchText)}`
      );
      const data = await res.json();
      setEvents(data);
      setStatus(data.length === 0 ? "No matching events" : "");
    } catch (err) {
      console.error(err);
      setStatus("Search failed");
    }
  };
  
  useEffect(() => {
    if (searchText.trim() === "") {
      fetchAllEvents();
    }
  }, [searchText]);

  const fetchAllEvents = () => {
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
  };

  useEffect(() => {
    fetchAllEvents();
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

      <Paper
        component="form"
        onSubmit={handleSearch}
        sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 300, mb: 2 }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search for events"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      
      {status && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {status}
        </Typography>
      )}
      {events.length === 0 ? (
        <Typography sx={{ mt: 2, textAlign: "center", color: "gray" }}>
          You don't have any registered events yet.
        </Typography>
      ) : (
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
    )}
    </Container>
  );
}

export default EventsPage;
