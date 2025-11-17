import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import EventsPage from "./events";
import EventDetailsPage from "./eventDetail";
import LoginCheck from "./LoginCheck";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/events" element={<LoginCheck><EventsPage /></LoginCheck>} />
        <Route path="/events/:id" element={<LoginCheck><EventDetailsPage /></LoginCheck>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
