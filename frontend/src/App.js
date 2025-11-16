import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import EventsPage from "./events";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/events" element={<EventsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
