import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";


const backend = `http://localhost:${process.env.REACT_APP_BE_PORT}/api/events/`;
function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetch(backend+id)
      .then(res => res.json())
      .then(data => setEvent(data));
  }, [id]);

  if (!event) return <p>Loading...</p>;

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4">{event.title}</Typography>
      <Typography>{new Date(event.date).toLocaleString()}</Typography>
      <Typography>{event.location}</Typography>
      <Typography sx={{ mt: 2 }}>{event.description}</Typography>
    </Container>
  );
}

export default EventDetailsPage;
