# ECE1779 Project - University Event Management Application - EventHub

To build backend and db run ```docker compose up --build -d```, on error run ```docker compose down -v```, then rerun build command after issue is solved.

Frontend-service External IP: `209.38.2.221`

API-Service External IP: `209.38.12.226`

## Team Members

| Name          | Student Number |
| ------------- | -------------- |
| Ziqi Zhu      | 1006172204     |
| Chang Sun     | 1003996205     |
| Zhang Yue     | 1011294387     |
| Shiming Zhang | 1011821129     |

## Motivation

## Objectives
The objective of this project was to design and implement a functional, full-stack School Event Management System that enables students to browse and register for events in one place, and organizers can manage events through an intuitive web interface. The project aimed to demonstrate a complete end-to-end workflow from frontend interaction and backend API design to database integration and secure user authentication while following the technical requirements of this class.

Another key objective was to develop a scalable and portable deployment environment using Docker and Kubernetes. This included containerizing the frontend, backend, and database components, managing environment variables and secrets securely, and enabling reliable updates and service orchestration in a cloud-native environment.

Finally, the project sought to build a maintainable and robust system architecture that supports multiple user roles, enforces secure access, and ensures data consistency. Through this implementation, the goal was to gain practical experience in building a real-world web application that integrates usability, security, and cloud deployment principles.

## Technical Stack

- Backend
  - Node.js is used to implement all the backend APIs, including creating, reading, updating, deleting a user/event/registration, searching for a registration with specific criteria, filtering the events, etc.
  - Three databases are used to store three tables that are needed for our university event management application, user, event, and registration.
- Frontend
- Containerization
  - Docker is used to containerize our university event management application.
  - Docker compose is used for our local multi-container setup.
- State Management
  - PostgreSQL is used to manage our three databases to store structured data for users, events, and registrations.
  - DigitalOcean automated backups and DigitalOcean Volumes are used to store our data persistently. This ensures that our data will not be lost even if the container restarts or we do a re-deployment.
- Deployment
  - DigitalOcean is used for deployment of our application which is more IaaS focused. It offers us Kubernetes integration (DOKS) and DigitalOcean Volumes for persistent storage.
- Orchestration
  - Kubernetes is used for robust orchestration. It perfectly fits our need to support persistent storage, pod auto-scaling, and seamless integration with monitoring tools.
- Monitoring
  - DigitalOcean built-in monitor is used to track the CPU, memory, and disk usage. It is also used to provide alerts during peak view and registration periods.
  - A nice dashboard from DigitalOcean is available to check the key metrics.

## Features

### Core Features

- User authentication
  - Functionality:
    - Users can sign up with name, university email, and password; duplicate emails are rejected.
    - Users can log in and receive a JWT access token (short-lived) and optionally a refresh token (longer-lived).
    - Users can log out (server revokes refresh token / rotates token).
    - Users can reset passwords via email link and change passwords after login.
  - Implementation:
    - We use a Node.js (Express) backend to handle user sign-up, login, and logout with password hashing and JSON Web Tokens (JWT) for session management. User credentials and roles are stored in a PostgreSQL table. Sensitive data such as JWT secrets and database URLs are managed securely through environment variables and Kubernetes Secrets. The frontend sends login requests and store tokens to access protected endpoints through HTTPS connections.

- Event CRUD Operations (Create, Read, Update, Delete)
  - Functionality:
    - Organizers or platform admins can add new events with details, such as title, description, date/time, location, category, etc.
    - Organizers or platform admins can update event details anytime to do reschedule or relocation. Or delete events if no longer happening.
    - All users can view the event listings, apply filters on attributes, like category, date, location, etc.
    - All users can register any event easily. Users can also view the registered events.
  - Implementation:
    - We use Node.js to handle the backend to perform all these operations. PostgreSQL is used to store all the metadata for the events. We integrate role-based access control with this feature.

- Database using PostgreSQL and persistent storage using DigitalOcean Volumes
  - Implementation:
    - We use PostgreSQL to manage our database to store structured data for users, events, event details, registrations, and analytics.
    - We use DigitalOcean automated backups and DigitalOcean Volumes to store our data persistently. We perform regular volume snapshots to ensure data accessibility.

- Dockerized Node.js Backend with Docker Compose for Multi-Container Setup
  - Implementation:
    - We containerize our application by using Docker for development and deployment.
    - We use Docker compose for our local multi-container setup including the Node.js backend, PostgreSQL database, etc.
    - Environment variables are used for configuration.

- Kubernetes for Orchestration
  - Kubernetes is used for orchestration for our application. We set it up to perform load balancing and auto-scaling. This ensures that our application will still be highly available even when there are lots of event queries or registrations happening at the same time.
  - Kubernetes is setup to deploy our university event management application so that anyone could access our app anytime from anywhere using a static URL.

- DigitalOcean Monitoring
  - DigitalOcean built-in monitoring is used to keep track of all the key metrics, CPU usage, memory usage, disk space, etc.
  - We have also set up alerts when DigitalOcean monitoring detects a sudden increase in the event queries or registrations.

### Advanced Features

- Role-based access control (e.g., Admin, Organizers, Student)
  - Functionality:
    - Admin: Manage all events and registrations; manage users (activate/disable, promote/demote roles). View global analytics dashboards.
    - Organizer: Create/update/delete their own events; view registrations and check-ins for their events. See real-time counts for their events on a dashboard.
    - Student: Browse and filter events; register/unregister; view My Registrations; receive email confirmations.
    - General rule: Users can only perform actions permitted by their role; sensitive endpoints require proper role claims. Ownership checks prevent organizers from editing others’ events.
  - Implementation:
    - Role-based access control is enforced through middleware that verifies JWT tokens and checks the user’s assigned role before allowing access to specific routes. Our database maintains each user’s role, and only authorized roles can perform actions such as creating, editing, or deleting events. Admins can manage all events and users, organizers can manage their own events, and students can only browse and register. This ensures clear permission boundaries and secure operation across all user types.

- Integration with Email Notifications
  - Functionality:
    - Users receive email notifications for registration confirmations. Users also receive email reminders the day before their registered events.
    - Users receive email notifications when there’s any update to the event, for example, time/location change, event cancellation.
    - Event organizers receive email notifications prior to their events to remind them the time and location, as well as how many users have registered for the event.
  - Implementation:
    - We use Mailtrap to demonstrate this functionality. It can also help the event organizers to send out emails to all the students to help promote their events and send out any newsletters.
    - With Mailtrap Sandbox, we are able to safely demonstrate and debug this feature without spamming any real-world email inboxes. Meanwhile, Mailtrap Sandbox also shows that our email notification feature is working as expected.

- Auto-Scaling and High Availability
  - Functionality:
    - Usually right after an event is posted by the organizers and users have received their email newsletter, many users will view the event and potentially register right away to secure their spots.
    - Therefore, we handle traffic spikes during peak view and registration periods.
    - We ensure the uptime of our stateful web application to be 24/7 so that users can view and register at anytime.
  - Implementation:
    - We use Kubernetes Services to do load balancing.
    - We also use DigitalOcean to monitor the CPU, memory, and disk usage and provide alerts during peak view and registration periods.
    - We take advantage of DigitalOcean Kubernetes auto-scaling feature to make sure our application is still available while large number of requests are hitting.

Our implementation aligns closely with the course project requirements. We use Docker Compose to containerize and manage our Node.js backend, PostgreSQL database, and React.js frontend in a multi-container setup. PostgreSQL serves as our persistent data store, and data durability is ensured through DigitalOcean Volumes, allowing state to survive container restarts or redeployments.

For orchestration, we use Kubernetes to deploy the application to a cloud-managed cluster on DigitalOcean, taking advantage of its scalability, fault tolerance, and service management features. We utilize the DigitalOcean monitoring dashboard to observe key metrics such as CPU, memory, and disk usage, and configure basic alerts to ensure operational stability.

## User Guide

## Development Guide
Following guide describes how to set up the development environment for the School Event Management System, including the frontend, backend, database, Docker-based setup, and Kubernetes deployment. Follow these steps to run the application locally or in a containerized environment.
### 1. Prerequisites

Before starting, ensure the **Docker & Docker Compose** are installed

### 2.Environment SetUp
#### 2.1 Backend Environment Variables

Create a .env file in `backend/` and copy the example backend environment file from `backend/.env`, to enable email function you need to replance MAILTRAP_USER and MAILTRAP_PASS by your own credentials, you can create an account from *https://mailtrap.io/*.
#### 2.2 Frontend Environment Variables

Create a .env file in `backend/` and copy the example frontend environment file from `frontend/.env`

### 3. Running the App with Docker Compose

From project root:

run ``docker compose up --build -d``

This will:

Build backend and frontend Docker images

Start PostgreSQL with mapped volume

Run all services in a network

Access the app at:

`http://localhost` and use one of credential from `init.sql` users section to log in or create your own account by sign up as a student.

When there is an update but you want to keep the current data in dataabase, run ``docker compose up --build -d`` 

If you don't want to keep current database and create again from `init.sql`, run ``docker compose down -v`` to remove volume and run ``docker compose up --build -d`` again.

## Deployment Information (if applicable)

## Individual Contributions

## Lessons Learned and Concluding Remarks
