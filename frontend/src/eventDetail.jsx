import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Typography, Button } from "@mui/material";


const backend = `${process.env.REACT_APP_BE_URL}/api`;

function EventDetailsPage() {
  const [isRegistered, setIsRegistered] = useState(false);
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userId = user.id;   

  useEffect(() => {
    fetch(`${backend}/events/${id}`)
      .then(res => res.json())
      .then(data => setEvent(data));
  }, [id]);

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const res = await fetch(`${backend}/registrations/check`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, event_id: id }),
        });

        const data = await res.json();

        if (data[0].status == 'registered') {
          setIsRegistered(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkRegistration();
  });

  if (!event) return <p>Loading...</p>;

  const handleRegister = async () => {

    try {
      const res = await fetch(`${backend}/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, event_id: id, status: "registered" }),
      });

      if (!res.ok) {
        throw new Error("Failed to register");
      }

      setIsRegistered(true);
      alert("Registered successfully!");
    } catch (err) {
      console.error(err);
      alert("Registration failed!");
    }
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4">{event.title}</Typography>
      <Typography>{new Date(event.date).toLocaleString()}</Typography>
      <Typography>{event.location}</Typography>
      <Typography sx={{ mt: 2 }}>{event.description}</Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={handleRegister}
        disabled={isRegistered}
      >
        {isRegistered ? "Cancel" : "Register"}
      </Button>

    </Container>
  );
}

export default EventDetailsPage;
