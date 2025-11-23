import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import EventsPage from "./events";
import Signup from "./Signup";
import EventDetailsPage from "./eventDetail";
import LoginCheck from "./LoginCheck";
import Layout from "./Layout";
import MyEventsPage from "./Myevent";
import CreateEvent from "./CreateEvent";
import EditEvent from "./EditEvent";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected pages */}
        <Route element={<LoginCheck><Layout /></LoginCheck>}>
          {/* Event list */}
          <Route path="/events" element={<EventsPage />} />

          {/* Create */}
          <Route path="/events/create" element={<CreateEvent />} />

          {/* Edit */}
          <Route path="/events/:id/edit" element={<EditEvent />} />

          {/* Event details */}
          <Route path="/events/:id" element={<EventDetailsPage />} />

          {/* My events */}
          <Route path="/Myevents" element={<MyEventsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
