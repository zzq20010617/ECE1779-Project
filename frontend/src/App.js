import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import EventsPage from "./events";
import EventDetailsPage from "./eventDetail";
import LoginCheck from "./LoginCheck";
import Layout from "./Layout";
import MyEventsPage from "./Myevent";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Login />} />

        {/* Protected routes under layout */}
        <Route element={<LoginCheck><Layout /></LoginCheck>}>
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/Myevents" element={<MyEventsPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
