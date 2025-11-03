CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password_hash TEXT,
    role VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    organizer_id INT REFERENCES users(id),
    title VARCHAR(150),
    status VARCHAR(10),
    description TEXT,
    location VARCHAR(150),
    date DATE,
    capacity INT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    event_id INT REFERENCES events(id),
    status VARCHAR(20),
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Initialize with test users 
INSERT INTO users (name, email, password_hash, role)
VALUES
  ('Alice Johnson', 'alice@utoronto.ca', 'hashed_pw_1', 'student'),
  ('Bob Chen', 'bob@utoronto.ca', 'hashed_pw_2', 'organizer'),
  ('Clara Singh', 'clara@utoronto.ca', 'hashed_pw_3', 'student'),
  ('David Kim', 'david@utoronto.ca', 'hashed_pw_4', 'admin');

-- Initialize with test events
INSERT INTO events (organizer_id, title, status, description, location, date, capacity)
VALUES
  (2, 'Career Fair 2025', 'active', 'Meet top employers and explore job opportunities across industries.', 'Convocation Hall', '2025-11-20', 200),
  (2, 'Tech Talk: AI and Society', 'active', 'A discussion on the ethical implications of artificial intelligence.', 'BA 1220', '2025-11-25', 100),
  (4, 'Wellness Workshop', 'canceled', 'Mindfulness and stress management session for students.', 'Robarts Library Room 250', '2025-12-02', 50),
  (4, 'Coding Bootcamp: Python for Beginners', 'active', 'Learn the fundamentals of Python programming.', 'Engineering Building ECF 101', '2025-11-28', 75);

-- Initialize with test events
INSERT INTO registrations (user_id, event_id, status)
VALUES
  (1, 1, 'registered'),  -- Alice → Career Fair
  (3, 1, 'registered'),  -- Clara → Career Fair
  (1, 2, 'registered'),  -- Alice → Tech Talk
  (3, 4, 'registered'),  -- Clara → Python Bootcamp
  (1, 4, 'canceled');    -- Alice canceled Python Bootcamp