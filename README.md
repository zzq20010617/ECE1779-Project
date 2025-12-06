# ECE1779-Project

To build backend and db run ```docker compose up --build -d```, on error run ```docker compose down -v```, then rerun build command after issue is solved.

Frontend-service External IP: 209.38.2.221
Api-Service External IP: 209.38.12.226

# Team Information
Ziqi Zhu 1006172204 ziqi.zhu@mail.utoronto.ca
# Motivation

# Objectives
The objective of this project was to design and implement a functional, full-stack School Event Management System that enables students to browse and register for events in one place, and organizers can manage events through an intuitive web interface. The project aimed to demonstrate a complete end-to-end workflow from frontend interaction and backend API design to database integration and secure user authentication while following the technical requirements of this class.

Another key objective was to develop a scalable and portable deployment environment using Docker and Kubernetes. This included containerizing the frontend, backend, and database components, managing environment variables and secrets securely, and enabling reliable updates and service orchestration in a cloud-native environment.

Finally, the project sought to build a maintainable and robust system architecture that supports multiple user roles, enforces secure access, and ensures data consistency. Through this implementation, the goal was to gain practical experience in building a real-world web application that integrates usability, security, and cloud deployment principles.

# Technical Stack

# Features

# User Guide

# Development Guide
Following guide describes how to set up the development environment for the School Event Management System, including the frontend, backend, database, Docker-based setup, and Kubernetes deployment. Follow these steps to run the application locally or in a containerized environment.
## 1. Prerequisites

Before starting, ensure the **Docker & Docker Compose** are installed

## 2.Environment SetUp
### 2.1 Backend Environment Variables

Create a .env file in `backend/` and copy the example backend environment file from `backend/.env`, to enable email function you need to replance MAILTRAP_USER and MAILTRAP_PASS by your own credentials, you can create an account from *https://mailtrap.io/*.
### 2.2 Frontend Environment Variables

Create a .env file in `backend/` and copy the example frontend environment file from `frontend/.env`

## 3. Running the App with Docker Compose

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

# Deployment Information (if applicable)

# Individual Contributions

# Lessons Learned and Concluding Remarks
