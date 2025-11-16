import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
function App() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    const backend =  "http://localhost:3000"
    fetch(backend)
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => setMessage("Failed to reach backend"));
  }, []);

  return (
    <div style={{ padding: "20px", fontSize: "20px" }}>
      <h1>Test Home Page</h1>
      <button
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          cursor: "pointer",
          marginTop: "20px",
        }}
        onClick={() => navigate("/events")}
      >View Events</button>
      <p>Backend says:</p>
      <pre>{message}</pre>
    </div>
  );
}

export default App;

