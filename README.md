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
University events play a central role in student life, connecting academic activities, professional development, and community engagement. However, the actual experience of finding and registering for events across a large campus like the University of Toronto is often fragmented and inefficient. Students frequently rely on scattered sources: departmental newsletters, physical posters, Discord channels, group chats, Instagram stories, or separate websites maintained by individual student clubs. As a result, students either miss opportunities or spend unnecessary time searching across multiple platforms to stay updated. On the organizer side, managing event capacity, updating details, and communicating changes can be equally challenging. Many student clubs rely on manual Google Forms or spreadsheets, which cannot easily support real-time updates, duplicate registration prevention, or automated notifications. This fragmented ecosystem motivated our team to build a modern, centralized, and scalable solution.

Our proposed School Event Management System aims to simplify this entire experience by providing one unified platform where students can explore events, check availability, and register instantly. For organizers, the system offers an efficient interface to create and modify event details without technical expertise. The goal is to eliminate the friction that currently exists between students and events, making it easier for campus communities to grow and stay connected. With cloud-native design principles, we also wanted to ensure that the system could scale seamlessly with traffic surges—particularly during peak registration periods like frosh week, job fairs, or high-demand workshops.

Another major motivation came from the technical side. ECE1779 emphasizes cloud computing, containerization, and distributed system design. Our team wanted to build a real, production-like application that applies these concepts rather than demonstrating them in isolation. A multifaceted system like event management allows us to work with a full technical stack: persistent databases, REST APIs, authentication, Dockerized applications, and Kubernetes orchestration. Deploying on DigitalOcean Kubernetes (DOKS) enabled us to gain hands-on experience with real cloud infrastructure, volume provisioning, rolling updates, and application resilience. Furthermore, integrating persistent storage via DigitalOcean Volumes gave us practical exposure to stateful workloads, which are commonly encountered in industry but harder to simulate with simple class projects.

Ultimately, our motivation was twofold: to solve a real problem that impacts student experience, and to challenge ourselves to design a reliable, scalable cloud-native system. The combination of practical value and technical depth made event management an ideal project for the course. By the end of the project, we aimed to deliver a platform that not only demonstrates our understanding of cloud computing but also provides a meaningful contribution to how students interact with campus events.

## Objectives
The objective of this project was to design and implement a functional, full-stack School Event Management System that enables students to browse and register for events in one place, and organizers can manage events through an intuitive web interface. The project aimed to demonstrate a complete end-to-end workflow from frontend interaction and backend API design to database integration and secure user authentication while following the technical requirements of this class.

Another key objective was to develop a scalable and portable deployment environment using Docker and Kubernetes. This included containerizing the frontend, backend, and database components, managing environment variables and secrets securely, and enabling reliable updates and service orchestration in a cloud-native environment.

Finally, the project sought to build a maintainable and robust system architecture that supports multiple user roles, enforces secure access, and ensures data consistency. Through this implementation, the goal was to gain practical experience in building a real-world web application that integrates usability, security, and cloud deployment principles.

## Technical Stack

- Backend
  - Node.js is used to implement all the backend APIs, including creating, reading, updating, deleting a user/event/registration, searching for a registration with specific criteria, filtering the events, etc.
  - Three databases are used to store three tables that are needed for our university event management application, user, event, and registration.
- Frontend
  - React.js is used to build the frontend and some components come from Matrial UI package.
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
The School Event Management System provides students and event organizers with a simple and intuitive interface for discovering, registering for, and managing campus activities. This guide explains how users interact with the platform in a natural, narrative format suitable for first-time users.
Users begin by visiting the live URL of the application deployed on our Kubernetes environment. The homepage displays a clean overview of upcoming events along with basic navigation options. To access interactive features such as event registration or viewing attendance records, users must first log in. The login page accepts any valid email address and password, and upon submitting their credentials, users are authenticated through the backend API. If authentication fails—such as entering an incorrect password or using an unregistered email—the system clearly notifies the user and prompts them to try again.

Once successfully logged in, users are brought to the Events page, which serves as the primary interface for exploring all available activities. Events are displayed with essential information including title, date and time, location, and current capacity status. Each event can be opened to reveal a detailed view containing a full description, hosting information, remaining seats, and any relevant notes from the organizer. These pages are designed to provide clarity and help users quickly assess whether an event matches their interests and schedule.

Registering for an event is a simple process. From the event details page, users can click the registration button, which immediately adds their name to the attendee list stored in the backend database. A confirmation message then appears to indicate that the registration was successful. The system checks for duplicate entries to ensure that each user can only register once per event. If the event has reached its maximum capacity, the interface clearly displays that the event is full and disables further registration attempts. These constraints are enforced at the API level to ensure accurate and real-time capacity management.

Users may review all of their upcoming commitments through the “My Registrations” section. This page lists the events they have registered for and includes essential logistical details such as dates and venues. If a user needs to cancel an existing registration, they can do so directly from this page. Cancellation triggers an immediate update in the backend, freeing up a seat and ensuring that the event’s capacity reflects the latest state. This helps maintain fairness and prevents valuable slots from being unused.

The system also provides a separate interface for event organizers. When users with organizer privileges log in, they gain access to an organizer dashboard that allows them to create and manage events. Creating a new event involves entering required details such as the event name, description, venue, time, and maximum capacity. Organizers can edit existing events at any time, making it easy to adjust information or respond to unexpected changes. They can also monitor registration numbers and view the attendee list to support real-world planning and resource allocation.

## Development Guide
Following guide describes how to set up the development environment for the School Event Management System, including the frontend, backend, database, Docker-based setup, and Kubernetes deployment. Follow these steps to run the application locally or in a containerized environment.
### 1. Prerequisites

Before starting, ensure the **Docker & Docker Compose** are installed

### 2.Environment SetUp
#### 2.1 Backend Environment Variables

Create a .env file in `backend/` and copy the example backend environment file from `backend/.env`, to enable email function you need to replance MAILTRAP_USER and MAILTRAP_PASS by your own credentials, you can create an account from *https://mailtrap.io/*.
#### 2.2 Frontend Environment Variables

Create a .env file in `frontend/` and copy the example frontend environment file from `frontend/.env`

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

## Deployment Information
our application is deployed on a **DigitalOcean Kubernetes (DOKS)** cluster.

- **Frontend (React.js Application)**
  - Deployed as a Kubernetes Deployment.
  - Exposed via a `LoadBalancer` Service named `frontend-service`.
  - External IP: `209.38.2.221`
  - Live URL: `http://209.38.2.221`

- **Backend API (Node.js / Express)**
  - Deployed as a Kubernetes Deployment.
  - Exposed via a `LoadBalancer` Service named `api-service`.
  - External IP: `209.38.12.226`
  - Base URL: `http://209.38.12.226:3000` (the frontend uses this address to reach the API).

- **Database (PostgreSQL)**
  - Runs inside the cluster and is exposed internally via a `ClusterIP` Service (e.g., `postgres-service` on port 5432).
  - Uses a **DigitalOcean Volume** as persistent storage so that data survives pod restarts and redeployments.
  - The initial schema and sample data (users, events, registrations) come from `init.sql`, which is executed when the database is first initialized.

- **Configuration and Secrets**
  - Sensitive configuration values, including database credentials, JWT secret keys, and Mailtrap credentials (`MAILTRAP_USER`, `MAILTRAP_PASS`), are stored in **Kubernetes Secrets** and injected as environment variables into the backend container.
  - Non-sensitive parameters (such as API base URLs used by the frontend) are managed through `.env` files and ConfigMaps.

- **Deployment Workflow**
  - Docker images for the frontend and backend are built from the project repository and pushed to a container registry.
  - Kubernetes manifests (`Deployment`, `Service`, `Secret`, etc.) are applied using `kubectl apply -f`.
  - Rolling updates are used so that new versions of the application can be deployed with minimal downtime.

- **Monitoring and Scaling**
  - **DigitalOcean Monitoring** is used to observe CPU, memory, and disk usage for the cluster.
  - Alerts are configured to notify the team when resource usage exceeds thresholds, which typically corresponds to spikes in event views and registrations.
  - DigitalOcean Kubernetes auto-scaling and manual adjustment of replica counts are used to keep the application responsive during peak load.


## Individual Contributions
- Ziqi Zhu:    
- Chang Sun: 
- Zhang Yue:I implemented the frontend sign up and create Account page and integrated it with the backend API. I also contributed to backend API development, helped maintain the Docker-based development setup, and supported deployment testing with PostgreSQL and Kubernetes.
- Shiming Zhang:
## Lessons Learned and Concluding Remarks
This project gave our team a complete, end-to-end experience in designing, implementing, and deploying a cloud-native web application.

From a **technical perspective**, we learned:

- How to design a **full-stack architecture** that connects a React frontend, a Node.js/Express backend, and a PostgreSQL database in a clean and maintainable way.
- How to use **Docker and Docker Compose** to create a reproducible local development environment with multiple containers, volumes, and networks.
- How to deploy a **stateful application on Kubernetes**, including:
  - Using Deployments and Services to manage pods and external access.
  - Managing persistent storage via DigitalOcean Volumes for PostgreSQL.
  - Handling secrets and configuration securely using Kubernetes Secrets and environment variables.
- How to integrate **authentication, authorization (RBAC), and email notifications** in a production-like environment using JWT and Mailtrap.
- How to leverage **DigitalOcean Monitoring and alerts** to understand performance, detect bottlenecks, and reason about scaling behavior during simulated peak loads.

From a **team and project management perspective**, we learned:

- The importance of agreeing on **API contracts** early so that frontend and backend can be developed in parallel with fewer integration issues.
- The value of keeping **infrastructure as code** (Dockerfiles, Compose files, Kubernetes manifests) in the repository so that everyone can reproduce the same environment and deployment state.
- That debugging a distributed system (frontend + backend + database + Kubernetes + cloud provider) requires systematic use of logs, metrics, and step-by-step isolation of components, rather than only relying on local testing.
- How dividing ownership (backend, frontend, infrastructure) while still sharing high-level understanding helps the whole system remain maintainable and easier to debug.

Overall, the **EventHub** system meets the goals we originally set in the Motivation and Objectives sections: it offers a centralized platform for managing university events and demonstrates the use of cloud-native technologies in a realistic setting. The project strengthened our understanding of containerization, orchestration, persistent storage, monitoring, and full-stack web development, and gave us experience that is directly transferable to real-world cloud applications.

## Video Demo
URL:
