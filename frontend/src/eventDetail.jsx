import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Typography, Button } from "@mui/material";
import {jwtDecode} from "jwt-decode";

const backend = `${process.env.REACT_APP_BE_URL}/api`;
const token = localStorage.getItem("token");

function EventDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [hover, setHover] = useState(false);
    const [registeredNum, setregisteredNum] = useState(0);
    const [registrationId, setRegistrationId] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);

    let currentUser = null;
    if (token) {
      currentUser = jwtDecode(token);
    }
    const userId = currentUser?.id;;

    const checkCapacity = async () => {
    try {
      const res = await fetch(`${backend}/registrations/capacity/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.registered != null) {
        setregisteredNum(data.registered);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetch(`${backend}/events/${id}`)
      .then((res) => res.json())
      .then((data) => setEvent(data));
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

        if (data[0]?.status === "registered") {
          setIsRegistered(true); 
          setRegistrationId(data[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkRegistration();
  }, [userId, id]);

  useEffect(() => {
    checkCapacity();
  }, [id]);

  if (!event) return <p>Loading...</p>;

  const handleRegister = async () => {
    try {
      const res = await fetch(`${backend}/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: userId,
          event_id: id,
          status: "registered",
        }),
      });

      if (!res.ok) throw new Error("Failed to register");
      
      setIsRegistered(true);
      await checkCapacity();
      alert("Registered successfully!");
    } catch (err) {
      console.error(err);
      alert("Registration failed!");
    }
  };

  const handleCancel = async () => {
    try {
      console.log(registrationId);
      const res = await fetch(`${backend}/registrations/${registrationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: 'canceled' }),
      });

      if (!res.ok) throw new Error("Cancel failed");

      setIsRegistered(false);
      await checkCapacity();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4">{event.title}</Typography>
      <Typography>{new Date(event.date).toLocaleString()}</Typography>
      <Typography>{event.location}</Typography>
      <Typography sx={{ mt: 2 }}>{event.description}</Typography>
      <Typography sx={{ mt: 2 }}>Capacity: {registeredNum}/{event.capacity}</Typography>
      <Button
        variant="contained"
          color={
            isRegistered
              ? hover
                ? "error"         // red when hovering
                : "secondary"     // grey when registered
              : "primary"         // blue when not registered
          }
        sx={{ mt: 3 }}
        onMouseEnter={() => isRegistered && setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={isRegistered ? handleCancel : handleRegister}
      >
        {isRegistered
          ? hover
            ? "Cancel Registration"
            : "Registered"
          : "Register"}
      </Button>
    </Container>
  );
}

export default EventDetailsPage;
